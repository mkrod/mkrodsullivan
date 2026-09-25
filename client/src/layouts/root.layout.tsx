import NavBar from "@/components/navbar";
import Note from "@/components/note";
import { ReactNode } from "react"

interface Props {
    children: ReactNode;
}

export default function RootLayout({ children }: Props) {


    return (
        <NavBar>
            <Note />
            {children}
        </NavBar>
    )
}
