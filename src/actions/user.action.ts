"use server";

import { updateTag } from "next/cache";
import { userService } from "@/services/user.service";

export const updateProfileAction = async (payload: {
  name?: string;
  phoneNumber?: string;
  image?: string;
}) => {
  const res = await userService.updateProfile(payload);

  if (res?.success) {
    updateTag("profile");
  }

  return res;
};
