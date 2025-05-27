import Header from "@components/Header";
import { IAProvider } from "@/contexts/IA";
import { InputIA } from "@/components/IA/InputIA";
import { HistoryIA } from "@/components/IA/HistoryIA";

export const IA = () => {
    return (
        <>
            <Header></Header>
            <section className="font-[Fredoka] flex flex-col gap-8 flex-1 items-start sm:p-12 p-4 justify-start">
                <IAProvider>
                    <h2 className="text-2xl">Chat IA</h2>
                    <HistoryIA></HistoryIA>
                    <InputIA />
                </IAProvider>
            </section>
        </>
    )
}
