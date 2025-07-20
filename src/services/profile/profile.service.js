import axiosClient from "../../utils/apiClient";

class ProfileService {
  async updateProfile(userId, profileData) {
    try {
      console.log('ProfileService: Profile data:', profileData);

      const response = await axiosClient.patch(`/user/${userId}`, profileData);
      console.log('ProfileService: Profile updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('ProfileService: Error updating profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }
}

const profileService = new ProfileService();
export default profileService;
