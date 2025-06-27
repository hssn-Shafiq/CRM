// SocialMediaPostingService.js - transitional file for backwards compatibility
import SocialMediaService, {
  LinkedInService,
  FacebookService,
  PinterestService
} from './SocialMediaServices';

// For backwards compatibility - redirect to the new structure
class SocialMediaPostingService {
  // LinkedIn methods
  static async postToLinkedIn(content, media, accessToken) {
    return LinkedInService.post(content, media, accessToken);
  }
  
  static async postToLinkedInWithMedia(content, mediaFiles, accessToken) {
    return LinkedInService.postWithMedia(content, mediaFiles, accessToken);
  }
  
  // New LinkedIn page methods
  static async getLinkedInPages(accessToken) {
    return LinkedInService.getLinkedInPages(accessToken);
  }
  
  static async postToLinkedInPage(content, media, accessToken, pageId) {
    return LinkedInService.postToPage(content, media, accessToken, pageId);
  }
  
  static async postToLinkedInPageWithMedia(content, mediaFiles, accessToken, pageId) {
    return LinkedInService.postWithMedia(content, mediaFiles, accessToken, { 
      targetType: "organization", 
      pageId 
    });
  }
  
  // Facebook methods
  static async postToFacebook(content, media, accessToken) {
    return FacebookService.post(content, media, accessToken);
  }
  
    // Pinterest methods
  static async postToPinterest(content, media, accessToken) {
    return PinterestService.post(content, media, accessToken);
  }
  
  static async postToPinterestWithMedia(content, mediaFiles, accessToken) {
    return PinterestService.postWithMedia(content, mediaFiles, accessToken);
  }
  
  static async getPinterestBoards(accessToken) {
    return PinterestService.getBoards(accessToken);
  }
  
  static async postToPinterestBoard(content, media, accessToken, boardId) {
    return PinterestService.postToBoard(content, media, accessToken, boardId);
  }

  // Unified methods
  static async postToAllPlatforms(content, media, platforms, type = "Post") {
    return SocialMediaService.postToAllPlatforms(content, media, platforms, type);
  }
  
  static async schedulePostsToAllPlatforms(content, media, platforms, scheduleDate, scheduleTime, type = "Post") {
    return SocialMediaService.schedulePostsToAllPlatforms(content, media, platforms, scheduleDate, scheduleTime, type);
  }
}

export default SocialMediaPostingService;
