import Footer from "../../components/layout/Footer";
import NavBar from "../../components/layout/NavBar"
import"./admin.css";
import {User, UsersRound, CirclePlus} from "lucide-react";
import AdminTable from "./AdminTable";

function AdminAddPage() {
    return (
        <>
        <div className="acontainer">
            <NavBar icons={{
                content: [
                {name: "profile", icon: <User /> },
                {name: "Pro santée", icon: <UsersRound />},
                {name: "Ajouter Admin", icon: <CirclePlus />}
            ]}}
                />
            <div className="acontent">
                <AdminTable/>
                <Footer />
            </div>
        </div>
        </>
    );
}

export default AdminAddPage;