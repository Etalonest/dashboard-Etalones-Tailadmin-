import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


const fetchAccountData = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ name: "Pedro Duarte", username: "@peduarte" }), 1000)
  );
};

export function AccountTab() {
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAccountData();
      setAccountData(data);
    };

    loadData();
  }, []);

  if (!accountData) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={accountData.name} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue={accountData.username} />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
