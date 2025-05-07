declare module 'react-simple-maps' {
  import * as React from 'react';

  // Geographies
  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => React.ReactNode;
  }
  export const Geographies: React.FC<GeographiesProps>;

  // Geography
  export interface GeographyProps {
    geography: any;
    key?: string;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>, geo: any) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>, geo: any) => void;
    onClick?: (event: React.MouseEvent<SVGPathElement>, geo: any) => void;
    [key: string]: any;
  }
  export const Geography: React.FC<GeographyProps>;

  // ComposableMap
  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      [key: string]: any;
    };
    width?: number;
    height?: number;
    [key: string]: any;
  }
  export const ComposableMap: React.FC<ComposableMapProps>;

  // ZoomableGroup
  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    [key: string]: any;
  }
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;

  // Marker
  export interface MarkerProps {
    coordinates: [number, number];
    [key: string]: any;
  }
  export const Marker: React.FC<MarkerProps>;

  // Line
  export interface LineProps {
    from: [number, number];
    to: [number, number];
    [key: string]: any;
  }
  export const Line: React.FC<LineProps>;

  // Sphere
  export interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [key: string]: any;
  }
  export const Sphere: React.FC<SphereProps>;

  // Graticule
  export interface GraticuleProps {
    step?: [number, number];
    [key: string]: any;
  }
  export const Graticule: React.FC<GraticuleProps>;

  // Annotations
  export interface AnnotationsProps {
    children: React.ReactNode;
    [key: string]: any;
  }
  export const Annotations: React.FC<AnnotationsProps>;

  // Annotation
  export interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    curve?: number;
    [key: string]: any;
  }
  export const Annotation: React.FC<AnnotationProps>;

  // AnnotationLabel
  export interface AnnotationLabelProps {
    [key: string]: any;
  }
  export const AnnotationLabel: React.FC<AnnotationLabelProps>;

  // Utility functions
  export function geoPath(): any;
  export function geoEqualEarth(): any;
  export function geoAlbers(): any;
  export function geoMercator(): any;
  export function geoAlbersUsa(): any;
}
