"use client"

import {useState, useEffect} from 'react'
import * as React from "react"
import Link from "next/link"
import Logo from '@/public/logo.png'

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import clsx from 'clsx'

export default function Header() {

    const [sticky, setSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setSticky(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
    

  return (
    <header className={clsx(
        "p-4 flex justify-center items-center border-b-2 border-gray-200/50", {
        "sticky": sticky,
        "top-0": sticky,
        "z-50": sticky,
        "bg-background": sticky,
        "dark:bg-background-dark": sticky,  
    })}
    >
        <Link href={'/'} className="w-full flex gap-2 justify-left items-center">
            <Image src={Logo} alt='Manu.AI' width={25} height={25} />
            <span className="font-semibold dark:text-white hidden md:block">MANU.AI</span>
        </Link>

        <NavigationMenu className='sm:block'>
        <NavigationMenuList className='gap-6'>
            <NavigationMenuItem>
            <NavigationMenuTrigger>Find Your Manual</NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[300px] lg:w-[400px]">
                    <ListItem href="/company" title="Search by Company">
                        Find your manual and browse others from the same manufacturer.
                    </ListItem>
                    <ListItem href="/products" title="Search by Product">
                        Search for your product and find its manual.
                    </ListItem>
                    <ListItem href="/company/whirlpool/w4000" title="Try a Demo">
                        Try a demo of Manu.AI.
                    </ListItem>
                </ul>
            </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
            <Link href="/upload_pdf" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Add Your Manual
                </NavigationMenuLink>
            </Link>
            </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>
        <div className='flex w-full flex-grow justify-end'></div>
        
    </header>
  )
}

const ListItem = React.forwardRef(function ListItem(
    { className, title, children, ...props },
    ref
) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";
