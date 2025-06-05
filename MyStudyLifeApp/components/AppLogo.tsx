import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { 
  Circle, 
  Rect, 
  Path, 
  Line, 
  Polygon, 
  Defs, 
  TextPath, 
  Text 
} from 'react-native-svg';

interface AppLogoProps {
  size?: number;
  showText?: boolean;
}

export default function AppLogo({ size = 100, showText = false }: AppLogoProps) {
  const viewBox = `0 0 ${size} ${size}`;
  const radius = size * 0.45;
  const innerRadius = size * 0.4;
  const strokeWidth = size * 0.02;

  if (showText) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={viewBox}>
          {/* Background Circle */}
          <Circle 
            cx={size/2} 
            cy={size/2} 
            r={radius} 
            fill="#3498db" 
            stroke="#2c3e50" 
            strokeWidth={strokeWidth * 1.5}
          />
          
          {/* Inner Background */}
          <Circle 
            cx={size/2} 
            cy={size/2} 
            r={innerRadius} 
            fill="#ecf0f1"
          />
          
          {/* Book Stack */}
          <Rect 
            x={size * 0.2} 
            y={size * 0.45} 
            width={size * 0.35} 
            height={size * 0.06} 
            fill="#e74c3c" 
            rx={size * 0.01}
          />
          <Rect 
            x={size * 0.22} 
            y={size * 0.38} 
            width={size * 0.33} 
            height={size * 0.06} 
            fill="#27ae60" 
            rx={size * 0.01}
          />
          <Rect 
            x={size * 0.24} 
            y={size * 0.31} 
            width={size * 0.31} 
            height={size * 0.06} 
            fill="#f39c12" 
            rx={size * 0.01}
          />
          
          {/* Open Book */}
          <Path 
            d={`M${size * 0.55} ${size * 0.35} Q${size * 0.65} ${size * 0.3} ${size * 0.75} ${size * 0.35} L${size * 0.75} ${size * 0.6} Q${size * 0.65} ${size * 0.55} ${size * 0.55} ${size * 0.6} Z`}
            fill="#fff" 
            stroke="#2c3e50" 
            strokeWidth={strokeWidth}
          />
          <Path 
            d={`M${size * 0.55} ${size * 0.35} Q${size * 0.45} ${size * 0.3} ${size * 0.35} ${size * 0.35} L${size * 0.35} ${size * 0.6} Q${size * 0.45} ${size * 0.55} ${size * 0.55} ${size * 0.6} Z`}
            fill="#fff" 
            stroke="#2c3e50" 
            strokeWidth={strokeWidth}
          />
          <Line 
            x1={size * 0.55} 
            y1={size * 0.35} 
            x2={size * 0.55} 
            y2={size * 0.6} 
            stroke="#2c3e50" 
            strokeWidth={strokeWidth}
          />
          
          {/* Book Lines */}
          <Line x1={size * 0.4} y1={size * 0.42} x2={size * 0.5} y2={size * 0.42} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
          <Line x1={size * 0.4} y1={size * 0.46} x2={size * 0.48} y2={size * 0.46} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
          <Line x1={size * 0.4} y1={size * 0.5} x2={size * 0.5} y2={size * 0.5} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
          
          <Line x1={size * 0.6} y1={size * 0.42} x2={size * 0.7} y2={size * 0.42} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
          <Line x1={size * 0.62} y1={size * 0.46} x2={size * 0.7} y2={size * 0.46} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
          <Line x1={size * 0.6} y1={size * 0.5} x2={size * 0.7} y2={size * 0.5} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
          
          {/* Pencil */}
          <Rect 
            x={size * 0.65} 
            y={size * 0.2} 
            width={size * 0.04} 
            height={size * 0.2} 
            fill="#f39c12" 
            rx={size * 0.02}
          />
          <Polygon 
            points={`${size * 0.65},${size * 0.2} ${size * 0.69},${size * 0.2} ${size * 0.67},${size * 0.16}`}
            fill="#e74c3c"
          />
          <Rect 
            x={size * 0.66} 
            y={size * 0.39} 
            width={size * 0.02} 
            height={size * 0.03} 
            fill="#2c3e50"
          />
          
          {/* Calendar Icon */}
          <Rect 
            x={size * 0.15} 
            y={size * 0.65} 
            width={size * 0.2} 
            height={size * 0.18} 
            fill="#fff" 
            stroke="#2c3e50" 
            strokeWidth={strokeWidth} 
            rx={size * 0.01}
          />
          <Rect 
            x={size * 0.15} 
            y={size * 0.65} 
            width={size * 0.2} 
            height={size * 0.05} 
            fill="#9b59b6" 
            rx={`${size * 0.01} ${size * 0.01} 0 0`}
          />
          <Line x1={size * 0.19} y1={size * 0.63} x2={size * 0.19} y2={size * 0.67} stroke="#2c3e50" strokeWidth={strokeWidth * 0.8}/>
          <Line x1={size * 0.31} y1={size * 0.63} x2={size * 0.31} y2={size * 0.67} stroke="#2c3e50" strokeWidth={strokeWidth * 0.8}/>
          
          {/* Calendar Dots */}
          <Circle cx={size * 0.19} cy={size * 0.73} r={size * 0.008} fill="#2c3e50"/>
          <Circle cx={size * 0.25} cy={size * 0.73} r={size * 0.008} fill="#2c3e50"/>
          <Circle cx={size * 0.31} cy={size * 0.73} r={size * 0.008} fill="#2c3e50"/>
          <Circle cx={size * 0.19} cy={size * 0.76} r={size * 0.008} fill="#e74c3c"/>
          <Circle cx={size * 0.25} cy={size * 0.76} r={size * 0.008} fill="#2c3e50"/>
          
          {/* Checkmark */}
          <Circle cx={size * 0.75} cy={size * 0.75} r={size * 0.1} fill="#27ae60"/>
          <Path 
            d={`M${size * 0.71} ${size * 0.75} L${size * 0.73} ${size * 0.77} L${size * 0.79} ${size * 0.73}`}
            stroke="#fff" 
            strokeWidth={strokeWidth * 1.2} 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Study Stars */}
          <Polygon 
            points={`${size * 0.85},${size * 0.25} ${size * 0.86},${size * 0.28} ${size * 0.89},${size * 0.28} ${size * 0.87},${size * 0.3} ${size * 0.88},${size * 0.33} ${size * 0.85},${size * 0.31} ${size * 0.82},${size * 0.33} ${size * 0.83},${size * 0.3} ${size * 0.81},${size * 0.28} ${size * 0.84},${size * 0.28}`}
            fill="#f1c40f"
          />
          <Polygon 
            points={`${size * 0.12},${size * 0.3} ${size * 0.13},${size * 0.32} ${size * 0.15},${size * 0.32} ${size * 0.14},${size * 0.33} ${size * 0.14},${size * 0.35} ${size * 0.12},${size * 0.34} ${size * 0.1},${size * 0.35} ${size * 0.11},${size * 0.33} ${size * 0.09},${size * 0.32} ${size * 0.11},${size * 0.32}`}
            fill="#f1c40f"
          />
          
          {/* App Title Arc */}
          <Defs>
            <Path 
              id="circle-text" 
              d={`M ${size/2} ${size/2} m -${size * 0.35} 0 a ${size * 0.35} ${size * 0.35} 0 1 1 ${size * 0.7} 0 a ${size * 0.35} ${size * 0.35} 0 1 1 -${size * 0.7} 0`}
            />
          </Defs>
          <Text 
            fontFamily="Arial, sans-serif" 
            fontSize={size * 0.11} 
            fontWeight="bold" 
            fill="#2c3e50"
          >
            <TextPath href="#circle-text" startOffset="25%">MyStudyLife</TextPath>
          </Text>
        </Svg>
      </View>
    );
  }

  // Simplified version without text
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={viewBox}>
        {/* Background Circle */}
        <Circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          fill="#3498db" 
          stroke="#2c3e50" 
          strokeWidth={strokeWidth * 1.5}
        />
        
        {/* Inner Background */}
        <Circle 
          cx={size/2} 
          cy={size/2} 
          r={innerRadius} 
          fill="#ecf0f1"
        />
        
        {/* Book Stack */}
        <Rect 
          x={size * 0.2} 
          y={size * 0.45} 
          width={size * 0.3} 
          height={size * 0.05} 
          fill="#e74c3c" 
          rx={size * 0.01}
        />
        <Rect 
          x={size * 0.22} 
          y={size * 0.39} 
          width={size * 0.28} 
          height={size * 0.05} 
          fill="#27ae60" 
          rx={size * 0.01}
        />
        <Rect 
          x={size * 0.24} 
          y={size * 0.33} 
          width={size * 0.26} 
          height={size * 0.05} 
          fill="#f39c12" 
          rx={size * 0.01}
        />
        
        {/* Open Book */}
        <Path 
          d={`M${size * 0.55} ${size * 0.35} Q${size * 0.65} ${size * 0.3} ${size * 0.75} ${size * 0.35} L${size * 0.75} ${size * 0.6} Q${size * 0.65} ${size * 0.55} ${size * 0.55} ${size * 0.6} Z`}
          fill="#fff" 
          stroke="#2c3e50" 
          strokeWidth={strokeWidth}
        />
        <Path 
          d={`M${size * 0.55} ${size * 0.35} Q${size * 0.45} ${size * 0.3} ${size * 0.35} ${size * 0.35} L${size * 0.35} ${size * 0.6} Q${size * 0.45} ${size * 0.55} ${size * 0.55} ${size * 0.6} Z`}
          fill="#fff" 
          stroke="#2c3e50" 
          strokeWidth={strokeWidth}
        />
        <Line 
          x1={size * 0.55} 
          y1={size * 0.35} 
          x2={size * 0.55} 
          y2={size * 0.6} 
          stroke="#2c3e50" 
          strokeWidth={strokeWidth}
        />
        
        {/* Book Lines */}
        <Line x1={size * 0.4} y1={size * 0.42} x2={size * 0.5} y2={size * 0.42} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
        <Line x1={size * 0.4} y1={size * 0.46} x2={size * 0.48} y2={size * 0.46} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
        <Line x1={size * 0.4} y1={size * 0.5} x2={size * 0.5} y2={size * 0.5} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
        
        <Line x1={size * 0.6} y1={size * 0.42} x2={size * 0.7} y2={size * 0.42} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
        <Line x1={size * 0.62} y1={size * 0.46} x2={size * 0.7} y2={size * 0.46} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
        <Line x1={size * 0.6} y1={size * 0.5} x2={size * 0.7} y2={size * 0.5} stroke="#bdc3c7" strokeWidth={strokeWidth * 0.6}/>
        
        {/* Pencil */}
        <Rect 
          x={size * 0.65} 
          y={size * 0.2} 
          width={size * 0.03} 
          height={size * 0.16} 
          fill="#f39c12" 
          rx={size * 0.015}
        />
        <Polygon 
          points={`${size * 0.65},${size * 0.2} ${size * 0.68},${size * 0.2} ${size * 0.665},${size * 0.16}`}
          fill="#e74c3c"
        />
        <Rect 
          x={size * 0.655} 
          y={size * 0.35} 
          width={size * 0.02} 
          height={size * 0.02} 
          fill="#2c3e50"
        />
        
        {/* Calendar Icon */}
        <Rect 
          x={size * 0.15} 
          y={size * 0.65} 
          width={size * 0.16} 
          height={size * 0.15} 
          fill="#fff" 
          stroke="#2c3e50" 
          strokeWidth={strokeWidth} 
          rx={size * 0.01}
        />
        <Rect 
          x={size * 0.15} 
          y={size * 0.65} 
          width={size * 0.16} 
          height={size * 0.04} 
          fill="#9b59b6" 
          rx={`${size * 0.01} ${size * 0.01} 0 0`}
        />
        <Line x1={size * 0.18} y1={size * 0.63} x2={size * 0.18} y2={size * 0.67} stroke="#2c3e50" strokeWidth={strokeWidth * 0.6}/>
        <Line x1={size * 0.28} y1={size * 0.63} x2={size * 0.28} y2={size * 0.67} stroke="#2c3e50" strokeWidth={strokeWidth * 0.6}/>
        
        {/* Calendar Dots */}
        <Circle cx={size * 0.19} cy={size * 0.73} r={size * 0.008} fill="#2c3e50"/>
        <Circle cx={size * 0.23} cy={size * 0.73} r={size * 0.008} fill="#2c3e50"/>
        <Circle cx={size * 0.27} cy={size * 0.73} r={size * 0.008} fill="#2c3e50"/>
        <Circle cx={size * 0.19} cy={size * 0.76} r={size * 0.008} fill="#e74c3c"/>
        <Circle cx={size * 0.23} cy={size * 0.76} r={size * 0.008} fill="#2c3e50"/>
        
        {/* Checkmark */}
        <Circle cx={size * 0.75} cy={size * 0.75} r={size * 0.1} fill="#27ae60"/>
        <Path 
          d={`M${size * 0.71} ${size * 0.75} L${size * 0.73} ${size * 0.77} L${size * 0.79} ${size * 0.71}`}
          stroke="#fff" 
          strokeWidth={strokeWidth * 1.2} 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Study Stars */}
        <Polygon 
          points={`${size * 0.85},${size * 0.25} ${size * 0.86},${size * 0.27} ${size * 0.88},${size * 0.27} ${size * 0.87},${size * 0.28} ${size * 0.87},${size * 0.3} ${size * 0.85},${size * 0.29} ${size * 0.83},${size * 0.3} ${size * 0.84},${size * 0.28} ${size * 0.82},${size * 0.27} ${size * 0.84},${size * 0.27}`}
          fill="#f1c40f"
        />
        <Polygon 
          points={`${size * 0.12},${size * 0.3} ${size * 0.13},${size * 0.32} ${size * 0.15},${size * 0.32} ${size * 0.14},${size * 0.33} ${size * 0.14},${size * 0.35} ${size * 0.12},${size * 0.34} ${size * 0.1},${size * 0.35} ${size * 0.11},${size * 0.33} ${size * 0.09},${size * 0.32} ${size * 0.11},${size * 0.32}`}
          fill="#f1c40f"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});