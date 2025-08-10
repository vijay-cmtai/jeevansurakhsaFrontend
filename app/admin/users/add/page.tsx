// 📁 File: app/admin/users/add/page.tsx

"use client";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { createUser } from "@/lib/redux/features/users/usersSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type FormInputs = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: "Admin" | "Manager";
  profilePic?: FileList;
};

export default function AddUserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { actionStatus } = useSelector((state: RootState) => state.users);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      role: "Manager",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("password", data.password);
    formData.append("role", data.role);
    if (data.profilePic && data.profilePic.length > 0) {
      // ✅ Field ka naam backend se match karna chahiye ('profilePicUrl' nahi, 'profilePic')
      formData.append("profilePic", data.profilePic[0]);
    }

    // ✅ Ab yeh dispatch call bilkul sahi se kaam karega kyunki slice mein path theek hai
    dispatch(createUser(formData)).then((result) => {
      if (createUser.fulfilled.match(result)) {
        toast({
          title: "User Created Successfully!",
          description: `A new ${result.payload.role} has been added to the system.`,
        });
        router.push("/admin/users/active"); // Redirect to the active users list
      } else {
        toast({
          title: "Error Creating User",
          description:
            (result.payload as string) || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Appoint New Dashboard User</CardTitle>
          <CardDescription>
            Create an account for a new Admin or Manager.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Assign Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">
                        Manager (Limited Access)
                      </SelectItem>
                      <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                {...register("mobile", {
                  required: "Mobile number is required",
                })}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobile.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Set Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="profilePic">Profile Picture (Optional)</Label>
              <Input
                id="profilePic"
                type="file"
                {...register("profilePic")}
                className="file:text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={actionStatus === "loading"}
            >
              {actionStatus === "loading" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {actionStatus === "loading" ? "Creating User..." : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
