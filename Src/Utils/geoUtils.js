
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
        return null; 
    }

    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; 
};


export const isWithinRadius = (originLat, originLon, destLat, destLon, radiusKm) => {
    if (!radiusKm) return true; 
    
    const distance = calculateHaversineDistance(originLat, originLon, destLat, destLon);
    
    if (distance === null) return false;
    if (distance === null) return false;

    return distance <= radiusKm;
};
