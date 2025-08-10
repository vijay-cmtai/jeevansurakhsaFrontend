"use client";

import { useDispatch, useSelector } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { sendNoticeToAll } from "@/lib/redux/features/notices/noticesSlice";
import { Label } from "@/components/ui/label";

type FormInputs = {
  title: string;
  subject: string;
  content: string;
};

export default function SendNoticeToAllPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { actionStatus } = useSelector((state: RootState) => state.notices);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    dispatch(sendNoticeToAll(data)).then((result) => {
      if (sendNoticeToAll.fulfilled.match(result)) {
        alert("Notice sent successfully to all active members!");
        reset(); // Clear the form on success
      } else {
        alert(`Error: ${result.payload}`);
      }
    });
  };

  return (
    <div className="flex justify-center items-start pt-10 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <Image
            src="https://jeevansuraksha.org/wp-content/uploads/2025/04/logo.webp"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full mb-4 bg-white p-1"
          />
          <CardTitle>Send Notice To All Users</CardTitle>
          <CardDescription>
            This will send a message to all 'Active' members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notice title"
                {...register("title", { required: "Title is required." })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter notice subject"
                {...register("subject", { required: "Subject is required." })}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your notice here..."
                rows={6}
                {...register("content", { required: "Content is required." })}
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 h-11"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? "Sending..." : "Send Now"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
