import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
import json
from datetime import datetime

# Set page configuration
st.set_page_config(
    page_title="Canada's Endangered Species Protection",
    page_icon="🍁",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
<style>
    .header {
        color: #d62728;
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 20px;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .subheader {
        color: #333;
        font-size: 25px;
        margin-bottom: 20px;
        text-align: center;
    }
    .highlight {
        background-color: #ffecb3;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
    }
    .danger {
        color: #d62728;
        font-weight: bold;
    }
    .success {
        color: #2ca02c;
        font-weight: bold;
    }
    .info-box {
        background-color: #f0f0f0;
        padding: 15px;
        border-radius: 5px;
        margin: 15px 0;
        border-left: 5px solid #1f77b4;
    }
    .species-counter {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0;
    }
    .footer {
        margin-top: 50px;
        text-align: center;
        font-size: 14px;
        color: #777;
    }
    .chart-container {
        border: 1px solid #ddd;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
        margin: 20px 0;
        background-color: white;
    }
    .canada-flag {
        text-align: center;
        margin: 20px 0;
        font-size: 30px;
    }
</style>
""", unsafe_allow_html=True)

# Header with Canadian theme
st.markdown('<div class="header">Canada\'s Endangered Species</div>', unsafe_allow_html=True)
st.markdown('<div class="subheader">Provincial & Territorial Conservation Status</div>', unsafe_allow_html=True)
st.markdown('<div class="canada-flag">🍁</div>', unsafe_allow_html=True)

# Generate synthetic data for endangered species in Canadian provinces
@st.cache_data
def generate_canada_data():
    # List of Canadian provinces and territories
    provinces = [
        'British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba', 
        'Ontario', 'Quebec', 'New Brunswick', 'Nova Scotia', 
        'Prince Edward Island', 'Newfoundland and Labrador', 
        'Yukon', 'Northwest Territories', 'Nunavut'
    ]
    
    # Province codes for mapping
    province_codes = [
        'BC', 'AB', 'SK', 'MB', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'YT', 'NT', 'NU'
    ]
    
    # Endangered species in Canada
    species = [
        'Whooping Crane', 'North Atlantic Right Whale', 'Vancouver Island Marmot', 
        'Woodland Caribou', 'Spotted Owl'
    ]
    
    # Create empty dataframe
    data = []
    
    # Current year for reference
    current_year = datetime.now().year
    
    # Generate data for each species in each province
    for species_name in species:
        for i, province in enumerate(provinces):
            # Generate random data with regional differences
            # Some species are more likely to be in certain regions
            
            # Default probability of presence
            presence_prob = 0.5
            
            # Adjust based on species and region
            if species_name == 'Whooping Crane':
                if province in ['Alberta', 'Saskatchewan', 'Manitoba']:
                    presence_prob = 0.9
                elif province in ['Ontario', 'Quebec']:
                    presence_prob = 0.3
                elif province in ['Nunavut', 'Yukon', 'Northwest Territories']:
                    presence_prob = 0.05
            
            elif species_name == 'North Atlantic Right Whale':
                if province in ['Newfoundland and Labrador', 'Nova Scotia', 'New Brunswick']:
                    presence_prob = 0.95
                elif province == 'Quebec':
                    presence_prob = 0.4
                else:
                    presence_prob = 0  # Not present in inland provinces
            
            elif species_name == 'Vancouver Island Marmot':
                if province == 'British Columbia':
                    presence_prob = 0.9
                else:
                    presence_prob = 0  # Endemic to BC
            
            elif species_name == 'Woodland Caribou':
                if province in ['British Columbia', 'Alberta', 'Saskatchewan', 'Manitoba', 'Ontario', 'Quebec']:
                    presence_prob = 0.8
                elif province in ['Yukon', 'Northwest Territories', 'Nunavut']:
                    presence_prob = 0.9
                else:
                    presence_prob = 0.1
            
            elif species_name == 'Spotted Owl':
                if province == 'British Columbia':
                    presence_prob = 0.8
                elif province == 'Alberta':
                    presence_prob = 0.3
                else:
                    presence_prob = 0.1
            
            # Determine if present based on probability
            is_present = np.random.random() < presence_prob
            
            # Generate data if present
            if is_present:
                population = np.random.randint(10, 500)
                protection_score = np.random.randint(1, 11)
                protected_areas = np.random.randint(1, 15)
                population_trend = np.random.choice(['Increasing', 'Stable', 'Decreasing'], 
                                                   p=[0.2, 0.3, 0.5])
                
                # Add years of conservation data
                conservation_start = np.random.randint(1980, 2010)
                years_of_protection = current_year - conservation_start
                
                # Success stories or conservation challenges
                if population_trend == 'Increasing':
                    narrative = f"Successful {species_name} conservation program in {province} has led to population increases of approximately {np.random.randint(10, 50)}% over the past decade."
                elif population_trend == 'Stable':
                    narrative = f"Conservation efforts for {species_name} in {province} have stabilized populations, but challenges remain."
                else:
                    narrative = f"Despite protection measures, {species_name} populations in {province} continue to decline due to {np.random.choice(['habitat loss', 'human development', 'climate change', 'disease'])}"
            else:
                population = 0
                protection_score = 0
                protected_areas = 0
                population_trend = 'None'
                conservation_start = None
                years_of_protection = 0
                narrative = f"No {species_name} populations currently recorded in {province}"
            
            # Add to data
            data.append({
                'Province': province,
                'Code': province_codes[i],
                'Species': species_name,
                'Population': population,
                'Protection_Score': protection_score,
                'Protected_Areas': protected_areas,
                'Population_Trend': population_trend,
                'Conservation_Start': conservation_start,
                'Years_Protected': years_of_protection,
                'Narrative': narrative
            })
    
    return pd.DataFrame(data)

# Load the data
df = generate_canada_data()

# Sidebar for filtering
st.sidebar.markdown("## Explore Canadian Endangered Species")
st.sidebar.markdown("Use the filters below to explore the distribution and protection status of endangered species across Canada.")

selected_species = st.sidebar.selectbox(
    "Select Species",
    options=df['Species'].unique().tolist(),
    index=0
)

# Filter the data based on selection
filtered_df = df[df['Species'] == selected_species]

# Information about the selected species
species_info = {
    'Whooping Crane': {
        'scientific_name': 'Grus americana',
        'status': 'Endangered',
        'population': 'Approximately 500 individuals',
        'habitat': 'Wetlands, marshes, and prairie potholes',
        'threats': 'Habitat loss, power line collisions, human disturbance',
        'protection': 'SARA (Species at Risk Act), Migratory Birds Convention Act'
    },
    'North Atlantic Right Whale': {
        'scientific_name': 'Eubalaena glacialis',
        'status': 'Endangered',
        'population': 'Fewer than 350 individuals',
        'habitat': 'Coastal waters of Atlantic Canada',
        'threats': 'Vessel strikes, fishing gear entanglement, underwater noise',
        'protection': 'SARA, Marine Mammal Regulations, Oceans Act'
    },
    'Vancouver Island Marmot': {
        'scientific_name': 'Marmota vancouverensis',
        'status': 'Critically Endangered',
        'population': 'Fewer than 300 individuals',
        'habitat': 'Alpine meadows on Vancouver Island, BC',
        'threats': 'Habitat loss, predation, small population size',
        'protection': 'SARA, BC Wildlife Act'
    },
    'Woodland Caribou': {
        'scientific_name': 'Rangifer tarandus caribou',
        'status': 'Threatened',
        'population': 'Declining across their range',
        'habitat': 'Boreal forests and tundra',
        'threats': 'Habitat fragmentation, predation, industrial development',
        'protection': 'SARA, provincial wildlife acts'
    },
    'Spotted Owl': {
        'scientific_name': 'Strix occidentalis',
        'status': 'Endangered',
        'population': 'Fewer than 30 wild individuals in Canada',
        'habitat': 'Old-growth forests in British Columbia',
        'threats': 'Habitat loss from logging, competition with Barred Owls',
        'protection': 'SARA, BC Wildlife Act'
    }
}

# Create columns for layout
col1, col2 = st.columns([2, 1])

with col2:
    # Species information card
    st.markdown("### Species Profile")
    info = species_info[selected_species]
    
    st.markdown(f"**{selected_species}** (*{info['scientific_name']}*)")
    st.markdown(f"**Conservation Status:** <span class='danger'>{info['status']}</span>", unsafe_allow_html=True)
    st.markdown(f"**Estimated Canadian Population:** {info['population']}")
    st.markdown(f"**Habitat:** {info['habitat']}")
    st.markdown(f"**Main Threats:** {info['threats']}")
    st.markdown(f"**Legal Protection:** {info['protection']}")
    
    # Conservation urgency meter
    st.markdown("### Conservation Urgency")
    
    # Determine urgency based on status
    if info['status'] == 'Critically Endangered':
        urgency = 90
        color = '#d62728'  # Red
    elif info['status'] == 'Endangered':
        urgency = 75
        color = '#ff7f0e'  # Orange
    else:
        urgency = 60
        color = '#ffbb78'  # Light orange
    
    # Create gauge chart for urgency
    fig = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = urgency,
        domain = {'x': [0, 1], 'y': [0, 1]},
        title = {'text': "Extinction Risk in Canada", 'font': {'size': 18}},
        gauge = {
            'axis': {'range': [None, 100], 'tickwidth': 1, 'tickcolor': "darkblue"},
            'bar': {'color': color},
            'bgcolor': "white",
            'borderwidth': 2,
            'bordercolor': "gray",
            'steps': [
                {'range': [0, 30], 'color': 'green'},
                {'range': [30, 70], 'color': 'orange'},
                {'range': [70, 100], 'color': 'red'}],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': urgency}
        }
    ))
    
    fig.update_layout(
        height=250,
        margin=dict(l=20, r=20, t=30, b=20),
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Canadian conservation actions
    st.markdown("### Canadian Conservation Initiatives")
    
    # Different messages based on species
    if selected_species == 'Whooping Crane':
        initiatives = """
        - Wood Buffalo National Park protection
        - Operation Migration captive breeding
        - Prairie wetland conservation
        - International cooperation with US
        """
    elif selected_species == 'North Atlantic Right Whale':
        initiatives = """
        - Vessel speed restrictions
        - Fishery closures during migration
        - Mandatory reporting of sightings
        - Disentanglement emergency response
        """
    elif selected_species == 'Vancouver Island Marmot':
        initiatives = """
        - Marmot Recovery Foundation breeding program
        - Protected habitat designation
        - Predator management
        - Reintroduction programs
        """
    elif selected_species == 'Woodland Caribou':
        initiatives = """
        - Boreal forest conservation
        - Wolf population management
        - Habitat protection from development
        - Indigenous co-management agreements
        """
    else:  # Spotted Owl
        initiatives = """
        - Old-growth forest protection
        - Captive breeding program
        - Barred owl control
        - Habitat mapping and monitoring
        """
    
    st.markdown(initiatives)

with col1:
    # Main choropleth map
    st.markdown("### Distribution & Protection Status Across Canada")
    
    # Prepare data for choropleth
    choropleth_data = filtered_df.copy()
    
    # Define GeoJSON for Canadian provinces
    canada_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "BC",
                "properties": {"name": "British Columbia"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-125, 48], [-125, 60], [-115, 60], [-115, 48], [-125, 48]]]
                }
            },
            {
                "type": "Feature",
                "id": "AB",
                "properties": {"name": "Alberta"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-115, 48], [-115, 60], [-110, 60], [-110, 48], [-115, 48]]]
                }
            },
            {
                "type": "Feature",
                "id": "SK",
                "properties": {"name": "Saskatchewan"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-110, 48], [-110, 60], [-102, 60], [-102, 48], [-110, 48]]]
                }
            },
            {
                "type": "Feature",
                "id": "MB",
                "properties": {"name": "Manitoba"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-102, 48], [-102, 60], [-95, 60], [-95, 48], [-102, 48]]]
                }
            },
            {
                "type": "Feature",
                "id": "ON",
                "properties": {"name": "Ontario"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-95, 48], [-95, 57], [-80, 57], [-80, 42], [-83, 42], [-90, 48], [-95, 48]]]
                }
            },
            {
                "type": "Feature",
                "id": "QC",
                "properties": {"name": "Quebec"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-80, 45], [-80, 62], [-65, 62], [-57, 51], [-61, 45], [-80, 45]]]
                }
            },
            {
                "type": "Feature",
                "id": "NB",
                "properties": {"name": "New Brunswick"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-67, 45], [-67, 48], [-64, 48], [-64, 45], [-67, 45]]]
                }
            },
            {
                "type": "Feature",
                "id": "NS",
                "properties": {"name": "Nova Scotia"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-64, 44], [-64, 47], [-60, 47], [-60, 44], [-64, 44]]]
                }
            },
            {
                "type": "Feature",
                "id": "PE",
                "properties": {"name": "Prince Edward Island"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-63, 46], [-63, 47], [-62, 47], [-62, 46], [-63, 46]]]
                }
            },
            {
                "type": "Feature",
                "id": "NL",
                "properties": {"name": "Newfoundland and Labrador"},
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [[[-58, 47], [-58, 52], [-53, 52], [-53, 47], [-58, 47]]],
                        [[[-61, 55], [-61, 60], [-55, 60], [-55, 55], [-61, 55]]]
                    ]
                }
            },
            {
                "type": "Feature",
                "id": "YT",
                "properties": {"name": "Yukon"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-141, 60], [-141, 70], [-128, 70], [-128, 60], [-141, 60]]]
                }
            },
            {
                "type": "Feature",
                "id": "NT",
                "properties": {"name": "Northwest Territories"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-128, 60], [-128, 70], [-102, 70], [-102, 60], [-128, 60]]]
                }
            },
            {
                "type": "Feature",
                "id": "NU",
                "properties": {"name": "Nunavut"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-102, 60], [-102, 83], [-55, 83], [-55, 60], [-102, 60]]]
                }
            }
        ]
    }
    
    # Create choropleth map of Canadian provinces using GeoJSON
    fig = px.choropleth(
        choropleth_data,
        geojson=canada_geojson,
        locations="Code",
        featureidkey="id",
        color="Protection_Score",
        color_continuous_scale=px.colors.sequential.YlOrRd_r,  # Reversed to make red = low protection
        hover_name="Province",
        labels={"Protection_Score": "Protection Level"},
        title=f"{selected_species} Protection Measures by Province/Territory",
        range_color=[0, 10],
        projection="mercator"
    )
    
    # Focus the map on Canada
    fig.update_geos(
        fitbounds="locations",
        visible=True,
        showcountries=False,
        showcoastlines=True,
        coastlinecolor="Black",
        showland=True,
        landcolor="lightgray"
    )
    
    # Customize layout
    fig.update_layout(
        autosize=True,
        margin=dict(l=0, r=0, b=0, t=30),
        coloraxis_colorbar=dict(
            title="Protection Level",
            thicknessmode="pixels", 
            thickness=20,
            lenmode="pixels", 
            len=300,
            tickvals=[0, 2, 4, 6, 8, 10],
            ticktext=["None", "Very Low", "Low", "Medium", "High", "Very High"]
        )
    )
    
    # Add title with emotional appeal
    fig.update_layout(
        title={
            'text': f"{selected_species} Protection Across Canada",
            'y':0.95,
            'x':0.5,
            'xanchor': 'center',
            'yanchor': 'top',
            'font': {'size': 22, 'color': '#333'}
        }
    )
    
    # Make hover information more detailed and emotive
    fig.update_traces(
        hovertemplate="<b>%{hovertext}</b><br><br>" +
                      "Protection Level: %{z}/10<br>" +
                      "Population: %{customdata[0]}<br>" +
                      "Population Trend: %{customdata[1]}<br>" +
                      "Protected Areas: %{customdata[2]}<br>" +
                      "Years Protected: %{customdata[3]}<br><br>" +
                      "%{customdata[4]}<extra></extra>",
        customdata=np.stack((
            choropleth_data['Population'],
            choropleth_data['Population_Trend'],
            choropleth_data['Protected_Areas'],
            choropleth_data['Years_Protected'],
            choropleth_data['Narrative']
        ), axis=-1)
    )
    
    # Enhance hover behavior
    fig.update_layout(
        hoverlabel=dict(
            bgcolor="white",
            font_size=12,
            font_family="Arial"
        ),
        hovermode="closest"
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    # Add contextual information about the map
    st.markdown("""
    <div class="info-box">
        <p>This map shows the level of protection for the selected endangered species across Canadian provinces and territories. 
        The color intensity indicates the strength of conservation measures, with darker red representing 
        stronger protection. Areas with no color indicate no recorded populations or protection measures.</p>
        
        <p>Hover over provinces to see detailed information about population status, protected areas, 
        and conservation narratives.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Population distribution bar chart
    st.markdown("### Population Distribution by Province")
    
    # Filter out provinces with no population
    pop_df = filtered_df[filtered_df['Population'] > 0].sort_values('Population', ascending=False)
    
    if len(pop_df) > 0:
        # Create bar chart
        fig3 = px.bar(
            pop_df,
            x="Province",
            y="Population",
            color="Population_Trend",
            hover_name="Province",
            color_discrete_map={
                "Increasing": "#2ca02c",  # Green
                "Stable": "#1f77b4",      # Blue
                "Decreasing": "#d62728"   # Red
            },
            title=f"{selected_species} Population by Province/Territory",
            labels={
                "Province": "Province/Territory",
                "Population": "Estimated Population"
            }
        )
        
        fig3.update_layout(
            height=400,
            xaxis={'categoryorder':'total descending'}
        )
        
        # Add threshold line for critical population levels
        if selected_species == 'Whooping Crane':
            threshold = 50
        elif selected_species == 'North Atlantic Right Whale':
            threshold = 30
        elif selected_species == 'Vancouver Island Marmot':
            threshold = 20
        elif selected_species == 'Woodland Caribou':
            threshold = 100
        else:  # Spotted Owl
            threshold = 10
            
        fig3.add_shape(
            type="line",
            x0=-0.5,
            y0=threshold,
            x1=len(pop_df)-0.5,
            y1=threshold,
            line=dict(color="red", width=2, dash="dash"),
        )
        
        fig3.add_annotation(
            x=len(pop_df)/2,
            y=threshold*1.1,
            text="Critical Population Threshold",
            showarrow=False,
            font=dict(color="red")
        )
        
        st.plotly_chart(fig3, use_container_width=True)
        
        # Add emotional impact message about provincial differences
        best_province = pop_df.iloc[0]['Province']
        worst_trend = pop_df[pop_df['Population_Trend'] == 'Decreasing']
        
        if len(worst_trend) > 0:
            worst_province = worst_trend.iloc[0]['Province']
            st.markdown(f"""
            <div class="info-box">
                <p>While {best_province} maintains the largest population of {selected_species}, 
                concerning declining trends in {worst_province} highlight the fragility of conservation efforts. 
                Consistent protection across all provinces is crucial for species recovery.</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="info-box">
                <p>{best_province} leads in {selected_species} conservation efforts with the largest provincial population. 
                Protection policies in this province could serve as a model for other regions to follow.</p>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <div class="info-box">
            <p>No provincial population data available for this species in Canada.</p>
        </div>
        """, unsafe_allow_html=True)

# Policy recommendations section with Canadian focus
st.markdown("## Canadian Policy Recommendations")

# Create three columns for recommendations
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown("""
    <div class="chart-container">
        <h3>Federal Government Actions</h3>
        <ul>
            <li>Strengthen SARA implementation and enforcement</li>
            <li>Increase funding for Parks Canada conservation programs</li>
            <li>Enhance cross-border conservation agreements with US</li>
            <li>Expand Indigenous Protected and Conserved Areas (IPCAs)</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="chart-container">
        <h3>Provincial & Territorial Measures</h3>
        <ul>
            <li>Harmonize wildlife protection laws across provinces</li>
            <li>Implement stricter environmental assessment processes</li>
            <li>Create more interconnected protected areas</li>
            <li>Develop province-specific recovery strategies</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown("""
    <div class="chart-container">
        <h3>Community & Economic Initiatives</h3>
        <ul>
            <li>Support Indigenous-led conservation programs</li>
            <li>Develop eco-tourism opportunities in rural communities</li>
            <li>Create tax incentives for private land conservation</li>
            <li>Establish industry-specific best practices</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

# Call to action with Canadian focus
st.markdown("""
<div class="highlight" style="text-align: center; padding: 20px; margin-top: 30px; background-color: #f8d7da; border-left: 5px solid #d62728;">
    <h2>Canada's Natural Heritage at Risk</h2>
    <p>Over 800 species are currently at risk in Canada, many found nowhere else on Earth.</p>
    <p>Our unique species are facing unprecedented pressure from habitat loss, climate change, and human development.</p>
    <p>As stewards of nearly 10% of the world's forests and 20% of its freshwater, Canadian conservation actions have global significance.</p>
</div>
""", unsafe_allow_html=True)

# Canadian conservation success stories
st.markdown("## Canadian Conservation Success Stories")

# Create columns for success stories
col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    <div class="chart-container">
        <h3>Peregrine Falcon Recovery</h3>
        <p>Once at risk of extinction due to DDT poisoning, the Peregrine Falcon has made a remarkable recovery in Canada. 
        Following the ban of DDT and implementation of captive breeding programs, the species was downlisted from endangered to threatened, 
        and in 2017 was further downlisted to "special concern" under SARA. Peregrine Falcons can now be found across Canada, 
        including in urban environments.</p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="chart-container">
        <h3>Sea Otter Reintroduction</h3>
        <p>Hunted to extinction in Canada by the fur trade by the early 1900s, sea otters were successfully reintroduced 
        to British Columbia's coast in the 1970s. From just 89 reintroduced individuals, the population has grown to over 
        7,000 today. This recovery has helped restore coastal kelp forest ecosystems and demonstrates how targeted 
        conservation efforts can bring a species back from the brink.</p>
    </div>
    """, unsafe_allow_html=True)

# Footer with timestamp and Canadian references
st.markdown("""
<div class="footer">
    <p>This visualization uses synthesized data for educational purposes only.</p>
    <p>References: Species at Risk Public Registry, Committee on the Status of Endangered Wildlife in Canada (COSEWIC), Parks Canada</p>
    <p>Last updated: April 2025 | Created for Canadian policy makers and conservation advocates</p>
</div>
""", unsafe_allow_html=True)