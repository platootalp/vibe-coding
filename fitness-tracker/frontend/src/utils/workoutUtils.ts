// Utility functions for workout data processing

// Function to automatically detect workout type based on data patterns
export const detectWorkoutType = (data: any): string => {
  // If we have GPS trace data, analyze movement patterns
  if (data.gpsTrace && Array.isArray(data.gpsTrace.coordinates)) {
    const coords = data.gpsTrace.coordinates;
    
    // Calculate average speed from GPS data
    if (coords.length > 1) {
      const totalDistance = calculateTotalDistance(coords);
      const totalTime = calculateTotalTime(coords);
      const avgSpeed = totalDistance / (totalTime / 3600); // km/h
      
      // Speed-based detection
      if (avgSpeed > 15) return 'cycling';
      if (avgSpeed > 5) return 'running';
      if (avgSpeed > 1) return 'walking';
    }
  }
  
  // Heart rate based detection
  if (data.heartRate && data.heartRate > 0) {
    if (data.heartRate > 150) return 'running';
    if (data.heartRate > 100) return 'cycling';
  }
  
  // Step count based detection
  if (data.steps && data.steps > 0) {
    if (data.steps > 5000) return 'walking';
  }
  
  // Distance based detection
  if (data.distance && data.distance > 0) {
    if (data.distance > 20) return 'cycling';
    if (data.distance > 5) return 'running';
    if (data.distance > 1) return 'walking';
  }
  
  // Default to other
  return 'other';
};

// Calculate total distance from GPS coordinates using Haversine formula
export const calculateTotalDistance = (coordinates: [number, number][]): number => {
  if (coordinates.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 1; i < coordinates.length; i++) {
    const [lat1, lon1] = coordinates[i - 1];
    const [lat2, lon2] = coordinates[i];
    
    // Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    totalDistance += distance;
  }
  
  return totalDistance;
};

// Calculate total time from GPS coordinates
export const calculateTotalTime = (coordinates: { timestamp: string }[]): number => {
  if (coordinates.length < 2) return 0;
  
  const firstTimestamp = new Date(coordinates[0].timestamp).getTime();
  const lastTimestamp = new Date(coordinates[coordinates.length - 1].timestamp).getTime();
  
  return (lastTimestamp - firstTimestamp) / 1000; // seconds
};

// Calculate calories burned based on workout data
export const calculateCalories = (workoutData: any, userProfile: any): number => {
  // Base metabolic rates (MET values) for different activities
  const metValues: Record<string, number> = {
    running: 8.0,
    cycling: 7.5,
    swimming: 6.0,
    walking: 3.5,
    strength: 5.0,
    yoga: 2.5,
    other: 3.0
  };
  
  // Get MET value for workout type
  const met = metValues[workoutData.type] || 3.0;
  
  // Get user weight (default to 70kg if not available)
  const weight = userProfile?.weight || 70;
  
  // Convert duration to hours
  const durationHours = (workoutData.duration || 0) / 60;
  
  // Calculate calories: MET * weight(kg) * duration(hours)
  const calories = met * weight * durationHours;
  
  return Math.round(calories);
};

// Process GPS trace data to extract statistics
export const processGpsTrace = (gpsTrace: any) => {
  if (!gpsTrace || !gpsTrace.coordinates || !Array.isArray(gpsTrace.coordinates)) {
    return {
      avgSpeed: 0,
      maxSpeed: 0,
      elevationGain: 0,
      totalDistance: 0
    };
  }
  
  const coordinates = gpsTrace.coordinates;
  const totalDistance = calculateTotalDistance(coordinates);
  const totalTime = calculateTotalTime(coordinates);
  
  // Calculate average speed (km/h)
  const avgSpeed = totalTime > 0 ? (totalDistance / (totalTime / 3600)) : 0;
  
  // Extract elevation data if available
  let elevationGain = 0;
  let maxElevation = -Infinity;
  let minElevation = Infinity;
  
  coordinates.forEach((coord: any) => {
    if (coord[2] !== undefined) { // elevation is third element
      const elevation = coord[2];
      maxElevation = Math.max(maxElevation, elevation);
      minElevation = Math.min(minElevation, elevation);
    }
  });
  
  if (maxElevation !== -Infinity && minElevation !== Infinity) {
    elevationGain = maxElevation - minElevation;
  }
  
  // Find max speed (simplified calculation)
  let maxSpeed = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [lat1, lon1] = coordinates[i - 1];
    const [lat2, lon2] = coordinates[i];
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // km
    
    // Time difference in hours
    const timeDiff = 1 / 3600; // Assuming 1 second intervals
    
    const speed = distance / timeDiff; // km/h
    maxSpeed = Math.max(maxSpeed, speed);
  }
  
  return {
    avgSpeed: parseFloat(avgSpeed.toFixed(2)),
    maxSpeed: parseFloat(maxSpeed.toFixed(2)),
    elevationGain: parseFloat(elevationGain.toFixed(2)),
    totalDistance: parseFloat(totalDistance.toFixed(2))
  };
};

// Transform Apple Health workout data
export const transformAppleHealthWorkout = (workout: any): any => {
  // Map Apple Health fields to our format
  return {
    name: workout.name || workout.workoutActivityType || 'Apple Health Workout',
    type: mapAppleHealthType(workout.workoutActivityType),
    duration: workout.duration ? workout.duration / 60 : 0, // Convert seconds to minutes
    calories: workout.activeEnergyBurned || workout.totalEnergyBurned || 0,
    distance: workout.distanceWalkingRunning || workout.distanceSwimming || workout.distanceCycling || 0,
    steps: workout.stepCount || 0,
    date: workout.startDate ? new Date(workout.startDate).toISOString() : new Date().toISOString(),
    notes: workout.notes || '',
    heartRate: workout.heartRate ? Math.round(workout.heartRate) : undefined,
    // GPS data if available
    gpsTrace: workout.locations ? {
      type: 'LineString',
      coordinates: workout.locations.map((loc: any) => [
        loc.longitude,
        loc.latitude,
        loc.altitude || 0
      ])
    } : undefined
  };
};

// Transform Huawei Health workout data
export const transformHuaweiHealthWorkout = (workout: any): any => {
  // Map Huawei Health fields to our format
  return {
    name: workout.name || workout.motionType || 'Huawei Health Workout',
    type: mapHuaweiHealthType(workout.motionType),
    duration: workout.duration || 0, // Already in minutes
    calories: workout.calorie || 0,
    distance: workout.distance || 0,
    steps: workout.stepCount || 0,
    date: workout.startTime ? new Date(workout.startTime).toISOString() : new Date().toISOString(),
    notes: workout.description || '',
    heartRate: workout.heartRate ? Math.round(workout.heartRate) : undefined,
    // GPS data if available
    gpsTrace: workout.polyline ? {
      type: 'LineString',
      coordinates: decodePolyline(workout.polyline)
    } : undefined
  };
};

// Map Apple Health workout types to our types
const mapAppleHealthType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'HKWorkoutActivityTypeRunning': 'running',
    'HKWorkoutActivityTypeCycling': 'cycling',
    'HKWorkoutActivityTypeSwimming': 'swimming',
    'HKWorkoutActivityTypeWalking': 'walking',
    'HKWorkoutActivityTypeStrengthTraining': 'strength',
    'HKWorkoutActivityTypeYoga': 'yoga',
    'HKWorkoutActivityTypeOther': 'other'
  };
  
  return typeMap[type] || 'other';
};

// Map Huawei Health workout types to our types
const mapHuaweiHealthType = (type: string): string => {
  const typeMap: Record<string, string> = {
    '10101': 'running',
    '10102': 'cycling',
    '10103': 'swimming',
    '10104': 'walking',
    '10201': 'strength',
    '10301': 'yoga',
    '10000': 'other'
  };
  
  return typeMap[type] || 'other';
};

// Decode polyline format used by Huawei Health
const decodePolyline = (encoded: string): [number, number, number][] => {
  // This is a simplified decoder - in practice, you might want to use a library like @mapbox/polyline
  // For now, we'll return an empty array as implementing a full decoder is beyond the scope
  return [];
};

// Transform imported workout data
export const transformImportedWorkout = (workout: any, userProfile: any) => {
  // Check if this is Apple Health data
  if (workout.workoutActivityType || workout.startDate) {
    workout = transformAppleHealthWorkout(workout);
  }
  // Check if this is Huawei Health data
  else if (workout.motionType || workout.startTime) {
    workout = transformHuaweiHealthWorkout(workout);
  }
  
  // Auto-detect workout type if not provided
  const type = workout.type || detectWorkoutType(workout);
  
  // Process GPS data if available
  const gpsStats: any = workout.gpsTrace ? processGpsTrace(workout.gpsTrace) : {};
  
  // Calculate calories if not provided
  const calories = workout.calories || calculateCalories(
    { ...workout, type },
    userProfile
  );
  
  return {
    ...workout,
    type,
    calories,
    avgSpeed: workout.avgSpeed || gpsStats.avgSpeed || 0,
    maxSpeed: workout.maxSpeed || gpsStats.maxSpeed || 0,
    elevationGain: workout.elevationGain || gpsStats.elevationGain || 0,
    distance: workout.distance || gpsStats.totalDistance || 0
  };
};