import Logo from "./Logo";

export default function DashboardHeader({user, location}) {
    return (
        <>
            <Logo name={location} />
            <div className="header-title">
                <h1>Gestaurante</h1>
                <h2>{user || "Hola"}</h2>
            </div>
        </>
    )
}