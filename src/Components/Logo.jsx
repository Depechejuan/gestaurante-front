import  logo from '../assets/logo/gestaurante-logo.png'

export default function Logo({ name }) {
    name = name+"-logo"
    return (
        <figure className={name} >
            <img src={logo} alt="Gestaurante Logo"/>
        </figure>
    )
}