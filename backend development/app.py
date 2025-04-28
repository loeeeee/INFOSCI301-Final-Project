from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

# Initialize app
app = Flask(__name__)
CORS(app)  # Simple CORS setup for frontend access

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://cansar_user:cansar_password@localhost/cansar_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database models
class Species(db.Model):
    __tablename__ = 'species'
    
    species_id = db.Column(db.Integer, primary_key=True)
    common_name = db.Column(db.String(255))
    scientific_name = db.Column(db.String(255))
    taxonomic_group = db.Column(db.String(100))
    endemic_NA = db.Column(db.Boolean)
    endemic_canada = db.Column(db.Boolean)
    
    status_assessments = db.relationship('StatusAssessment', backref='species', lazy=True)
    locations = db.relationship('Location', backref='species', lazy=True)

class StatusAssessment(db.Model):
    __tablename__ = 'status_assessments'
    
    assessment_id = db.Column(db.Integer, primary_key=True)
    species_id = db.Column(db.Integer, db.ForeignKey('species.species_id'))
    year = db.Column(db.Integer)
    cosewic_status = db.Column(db.String(100))
    sara_status = db.Column(db.String(100))
    doc_type = db.Column(db.String(255))
    
    threats = db.relationship('Threat', backref='assessment', lazy=True)
    actions = db.relationship('Action', backref='assessment', lazy=True)

class Threat(db.Model):
    __tablename__ = 'threats'
    
    threat_id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('status_assessments.assessment_id'))
    iucn_threat_code = db.Column(db.String(20))
    impact = db.Column(db.String(50))
    scope = db.Column(db.String(50))
    severity = db.Column(db.String(50))
    timing = db.Column(db.String(50))

class Action(db.Model):
    __tablename__ = 'actions'
    
    action_id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('status_assessments.assessment_id'))
    action_type = db.Column(db.String(100))
    action_subtype = db.Column(db.String(100))
    notes = db.Column(db.Text)

class Location(db.Model):
    __tablename__ = 'locations'
    
    location_id = db.Column(db.Integer, primary_key=True)
    species_id = db.Column(db.Integer, db.ForeignKey('species.species_id'))
    province_territory = db.Column(db.String(100))
    eoo = db.Column(db.Float)
    iao = db.Column(db.Float)

class CsiTrend(db.Model):
    __tablename__ = 'csi_trends'
    
    year = db.Column(db.Integer, primary_key=True)
    national_index = db.Column(db.Float)
    birds_index = db.Column(db.Float)
    mammals_index = db.Column(db.Float)
    fish_index = db.Column(db.Float)
    number_species = db.Column(db.Integer)
    number_bird_species = db.Column(db.Integer)
    number_mammal_species = db.Column(db.Integer)
    number_fish_species = db.Column(db.Integer)

# API Routes
@app.route('/api/csi-trends', methods=['GET'])
def get_csi_trends():
    trends = CsiTrend.query.all()
    result = [{
        'year': trend.year,
        'national_index': trend.national_index,
        'birds_index': trend.birds_index,
        'mammals_index': trend.mammals_index,
        'fish_index': trend.fish_index,
        'number_species': trend.number_species,
        'number_bird_species': trend.number_bird_species,
        'number_mammal_species': trend.number_mammal_species,
        'number_fish_species': trend.number_fish_species
    } for trend in trends]
    return jsonify(result)

@app.route('/api/cansar/status-over-time', methods=['GET'])
def get_status_over_time():
    # Get optional query parameter for taxonomic group
    group = request.args.get('group')
    
    # Base query joining Species and StatusAssessment
    query = db.session.query(
        StatusAssessment.year,
        StatusAssessment.sara_status,
        db.func.count(StatusAssessment.assessment_id)
    ).join(Species)
    
    # Apply filter if group is specified
    if group:
        query = query.filter(Species.taxonomic_group == group)
    
    # Group by and execute
    result = query.group_by(
        StatusAssessment.year,
        StatusAssessment.sara_status
    ).all()
    
    # Format result
    formatted_result = [
        {
            'year': item[0],
            'status': item[1],
            'count': item[2]
        }
        for item in result if item[0] is not None  # Filter out None years
    ]
    
    return jsonify(formatted_result)

@app.route('/api/cansar/summary/province', methods=['GET'])
def get_province_summary():
    # Query locations and count species by province
    result = db.session.query(
        Location.province_territory,
        db.func.count(db.distinct(Location.species_id)).label('species_count')
    ).group_by(Location.province_territory).all()
    
    # For each province, get representative species (limit to 5)
    formatted_result = []
    
    for province, count in result:
        # Skip if province is null
        if not province:
            continue
            
        # Get representative species
        species = db.session.query(
            Species.common_name,
            Species.scientific_name,
            Species.taxonomic_group,
            StatusAssessment.sara_status
        ).join(Location).join(StatusAssessment).filter(
            Location.province_territory == province
        ).limit(5).all()
        
        rep_species = [
            {
                'common_name': s[0],
                'scientific_name': s[1],
                'taxonomic_group': s[2],
                'sara_status': s[3]
            }
            for s in species
        ]
        
        formatted_result.append({
            'province': province,
            'species_count': count,
            'representative_species': rep_species
        })
    
    return jsonify(formatted_result)

@app.route('/api/cansar/summary/threats', methods=['GET'])
def get_threat_summary():
    # Query threats and count by IUCN code
    result = db.session.query(
        Threat.iucn_threat_code,
        db.func.count(Threat.threat_id).label('count'),
        db.func.avg(db.cast(Threat.impact, db.Float)).label('avg_impact')
    ).group_by(Threat.iucn_threat_code).all()
    
    formatted_result = [
        {
            'threat_code': item[0],
            'count': item[1],
            'average_impact': float(item[2]) if item[2] is not None else None
        }
        for item in result
    ]
    
    return jsonify(formatted_result)

@app.route('/api/cansar/summary/actions', methods=['GET'])
def get_action_summary():
    # Query actions and count by type
    result = db.session.query(
        Action.action_type,
        db.func.count(Action.action_id).label('count')
    ).group_by(Action.action_type).all()
    
    formatted_result = [
        {
            'action_type': item[0],
            'count': item[1]
        }
        for item in result if item[0] is not None
    ]
    
    return jsonify(formatted_result)

# Run the application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
