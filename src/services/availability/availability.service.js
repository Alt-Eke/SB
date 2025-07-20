import axiosClient from "../../utils/apiClient";

class AvailabilityService {
  async updateAvailability(id, availabilityData) {
    try {
      console.log('AvailabilityService: Updating availability:', { id, availabilityData });
      
      const response = await axiosClient.patch(`/study-budy/availability/${id}`, availabilityData);
      console.log('AvailabilityService: Availability updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AvailabilityService: Error updating availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to update availability');
    }
  }

  async deleteAvailability(id) {
    try {
      console.log('AvailabilityService: Deleting availability:', id);
      
      const response = await axiosClient.delete(`/study-budy/availability/${id}`);
      console.log('AvailabilityService: Availability deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AvailabilityService: Error deleting availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete availability');
    }
  }

  async createAvailability(availabilityData) {
    try {
      console.log('AvailabilityService: Creating availability:', availabilityData);
      
      const response = await axiosClient.post('/study-budy/availability', availabilityData);
      console.log('AvailabilityService: Availability created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AvailabilityService: Error creating availability:', error);
      throw new Error(error.response?.data?.message || 'Failed to create availability');
    }
  }

  async getUserAvailabilities(userId) {
    try {
      console.log('AvailabilityService: Fetching user availabilities:', userId);
      
      const response = await axiosClient.get(`/study-budy/availability/user/${userId}`);
      console.log('AvailabilityService: Availabilities fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AvailabilityService: Error fetching availabilities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch availabilities');
    }
  }
}

const availabilityService = new AvailabilityService();
export default availabilityService;