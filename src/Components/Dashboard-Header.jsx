import Logo from "./Logo";

export default function DashboardHeader({user}) {
    return (
        
        <header>
            <div className="header-logo">
                <Logo />
            </div>
            <div className="header-title">
                <h1>Gestaurante</h1>
                <h2>{user || "Hola"}</h2>
            </div>
        </header>
    )
}