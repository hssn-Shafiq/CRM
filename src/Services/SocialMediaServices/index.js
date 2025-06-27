// Main export file for all social media services
import LinkedInService from './LinkedInService';
import FacebookService from './FacebookService';
import ApiConfiguration from './ApiConfiguration';
import SocialMediaPostScheduler from './SocialMediaPostScheduler';
import PinterestService from './PinterestService';
// Export all services
export {
  LinkedInService,
  FacebookService,
  ApiConfiguration,
  SocialMediaPostScheduler,
  PinterestService
};
  
// Also export a unified service for convenience
export default class SocialMediaService {
  static async postToAllPlatforms(content, media, platforms, type = "Post") {
    const results = [];
    const errors = [];

    // Get tokens for each platform
    const platformTokens = {
      linkedin: localStorage.getItem("linkedin_token"),
      facebook: localStorage.getItem("facebook_token"),
      pinterest: localStorage.getItem("pinterest_token"),
      // Add other platforms as needed
    };

    // Process each selected platform
    for (const platform of platforms) {
      // Handle both simple string platform names and complex objects with settings
      const platformName = typeof platform === 'string' ? platform : platform.name;
      const platformSettings = typeof platform === 'object' ? platform : {};
      
      const token = platformTokens[platformName.toLowerCase()];

      if (!token) {
        errors.push({
          platform: platformName,
          error: "No access token found. Please reconnect your account.",
        });
        continue;
      }

      try {
        let result;
        switch (platformName.toLowerCase()) {
          case "linkedin":
            // Handle LinkedIn post with settings for profile vs page
            const linkedinTargetType = platformSettings.targetType || "person";
            const linkedinPageId = platformSettings.pageId;
            
            if (media && media.length > 0) {
              result = await LinkedInService.postWithMedia(
                content, 
                media, 
                token, 
                { targetType: linkedinTargetType, pageId: linkedinPageId }
              );
            } else if (linkedinTargetType === "organization" && linkedinPageId) {
              result = await LinkedInService.postToPage(content, [], token, linkedinPageId);
            } else {
              result = await LinkedInService.post(content, [], token);
            }
            break;
            
          case "facebook":
            result = await FacebookService.post(content, media, token);
            break;

             case "pinterest":
            const boardId = platformSettings.boardId;
            if (boardId) {
              result = await PinterestService.postToBoard(content, media, token, boardId);
            } else {
              result = await PinterestService.post(content, media, token);
            }
            break;
          // Add cases for other platforms
          default:
            errors.push({
              platform: platformName,
              error: "Posting not yet implemented for this platform.",
            });
            continue;
        }

        results.push(result);
      } catch (error) {
        errors.push({
          platform: platformName,
          error: error.error || "Unknown error occurred",
        });
      }
    }

    return {
      success: errors.length === 0 && results.length > 0,
      results,
      errors,
    };
  }

  static async schedulePostsToAllPlatforms(
    content,
    media,
    platforms,
    scheduleDate,
    scheduleTime,
    type = "Post"
  ) {
    return SocialMediaPostScheduler.schedulePostsToAllPlatforms(
      content,
      media,
      platforms,
      scheduleDate,
      scheduleTime,
      type
    );
  }
}