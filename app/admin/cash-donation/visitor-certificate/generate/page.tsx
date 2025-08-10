"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="bg-green-500 text-white text-center p-3 rounded-md">
            Visitor Certificate Generation Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Enter Name" />
            <Input placeholder="Enter Father Name" />
            <Input placeholder="Enter Mobile No." />
            <Input placeholder="Enter Email Id." />
            <Input placeholder="Enter Program" />
          </div>
          <div className="text-center space-y-4 pt-4">
            <h3 className="font-semibold">Select Template</h3>
            <div className="flex justify-center gap-4">
              <div className="w-32 h-20 border-2 border-blue-500 rounded-md bg-gray-100 cursor-pointer"></div>
              <div className="w-32 h-20 border-2 border-gray-300 rounded-md bg-gray-100 cursor-pointer"></div>
              <div className="w-32 h-20 border-2 border-gray-300 rounded-md bg-gray-100 cursor-pointer"></div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600">
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
