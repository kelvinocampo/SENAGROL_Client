import { ChatsList } from "../../components/Chats/ChatList"
import { Routes, Route, useLocation } from "react-router-dom"
import { Chat } from "@/components/Chats/Chat";
import { UserList } from "@/components/Chats/UserList";
import { NavBarChats } from "@/components/Chats/NavBar";
import { ChatsProvider } from "@/contexts/Chats";
import { AnimatePresence, motion } from "framer-motion";

export const Chats = () => {
    const location = useLocation();

    const pageVariants = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    };

    const pageTransition = {
        duration: 0.4,
        ease: "easeInOut"
    };

    return (
        <section className='min-h-screen flex-1 flex flex-col p-4 gap-4 font-[fredoka] bg-gray-50'>
            <NavBarChats />
            <ChatsProvider>
                <div className="flex-1 w-full relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                            <Route
                                path=""
                                element={
                                    <motion.div
                                        className="absolute w-full h-full"
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                    >
                                        <ChatsList />
                                    </motion.div>
                                }
                            />
                            <Route
                                path="usuarios"
                                element={
                                    <motion.div
                                        className="absolute w-full h-full"
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                    >
                                        <UserList />
                                    </motion.div>
                                }
                            />
                            <Route
                                path=":id_chat"
                                element={
                                    <motion.div
                                        className="absolute w-full h-full"
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        variants={pageVariants}
                                        transition={pageTransition}
                                    >
                                        <Chat />
                                    </motion.div>
                                }
                            />
                        </Routes>
                    </AnimatePresence>
                </div>
            </ChatsProvider>
        </section>
    );
};
