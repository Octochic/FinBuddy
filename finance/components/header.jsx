import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, PenBox } from "lucide-react";
const Header = () => {
    return (
    <div className="fixed top-0 w-full bg-white backdrop-blur-md z-50  border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src={"/Finbuddy.png"} alt="Finbuddy Logo" height={60} width={300}
          className="h-12 w-auto object-cover"/>
        </Link>
            <div className="flex items-center space-x-4"> 
              <SignedIn>
                <Link href={"/dashboard"}>
                  <Button variant="outline">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link href={"/transaction/create"} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                  <Button  className="flex items-center gap-2">
                  <PenBox size={18} />
                  <span className="hidden md:inline">Add Transaction</span>
                  </Button>
                </Link>
                
              </SignedIn>
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton  appearance={{elements:{avatarBox: "w-12 h-12"}}}/>
            </SignedIn>
            </div>
          </nav>
    </div>
    )
};

export default Header;
