import { CommunityTypeModel } from "@/models/communityType.model.js";

export class CommunityTypeService {
    static async getAllCommunityType() {
        return CommunityTypeModel.findAll();
    }
}