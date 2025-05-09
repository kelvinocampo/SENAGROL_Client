import { LocationPicker } from "./LocationPicker"

export const FormCreate = () => {
  return (
    <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
      <h2 className="sm:text-4xl text-2xl font-lightbold">Crear Producto</h2>
      <form action="">
        <LocationPicker />
      </form>
    </section>
  )
}
