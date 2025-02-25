import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://psgc.gitlab.io/api'
});

export const useAddressFields = (isOpen, isSignIn) => {
  const [addressData, setAddressData] = useState({
    regions: [],
    cities: [],
    barangays: [],
  });

  const [selected, setSelected] = useState({
    region: '',
    city: '',
    barangay: '',
    exactLocation: '' // New field for street, block, building, etc.
  });

  const [loading, setLoading] = useState({
    regions: false,
    cities: false,
    barangays: false
  });

  const fetchData = useCallback(async (endpoint) => {
    try {
      const { data } = await api.get(endpoint);
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  }, []);

  const fetchRegions = useCallback(async () => {
    setLoading(prev => ({ ...prev, regions: true }));
    const regions = await fetchData('/regions');
    setAddressData(prev => ({ ...prev, regions }));
    setLoading(prev => ({ ...prev, regions: false }));
  }, [fetchData]);

  const handleRegionChange = useCallback(async (regionCode) => {
    setSelected(prev => ({
      region: regionCode,
      city: '',
      barangay: '',
      exactLocation: prev.exactLocation
    }));

    if (!regionCode) return;

    setLoading(prev => ({ ...prev, cities: true }));
    // Fetch all cities in the region directly
    const cities = await fetchData(`/regions/${regionCode}/cities-municipalities`);
    console.log('Fetching cities for region:', regionCode);
    console.log('Fetched cities:', cities);
    setAddressData(prev => ({ ...prev, cities, barangays: [] }));
    setLoading(prev => ({ ...prev, cities: false }));
  }, [fetchData]);

  const handleCityChange = useCallback(async (cityCode) => {
    setSelected(prev => ({
      ...prev,
      city: cityCode,
      barangay: ''
    }));

    if (!cityCode) return;

    setLoading(prev => ({ ...prev, barangays: true }));
    const barangays = await fetchData(`/cities-municipalities/${cityCode}/barangays`);
    setAddressData(prev => ({ ...prev, barangays }));
    setLoading(prev => ({ ...prev, barangays: false }));
  }, [fetchData]);

  const handleExactLocationChange = useCallback((value) => {
    setSelected(prev => ({
      ...prev,
      exactLocation: value
    }));
  }, []);

  useEffect(() => {
    if (isOpen && !isSignIn) {
      console.log('Fetching initial regions');
      fetchRegions();
    }
  }, [isOpen, isSignIn, fetchRegions]);

  return {
    addressData,
    selected,
    loading,
    handleRegionChange,
    handleCityChange,
    handleExactLocationChange,
    setSelected
  };
};