import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Navbar from '../../components/ui/Navbar';
import Spinner from '../../components/ui/Spinner';

export default function Feedback() {
    const router = useRouter();
    const { query } = router;
    const [formState, setFormState] = useState({ loading: false, error: false });

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setFormState({ loading: false, error: true });
        router.push(`${query.nextpage}`);
    };

    return (
        <Layout>
            <Navbar
                pageTitle="Feedback Form"
                subChapterTitle="The Great Sync"
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageType="listing"
            />
            <section className="w-[90%] max-h-[auto] max-w-[40rem] md:w-[30rem] p-8 mx-auto my-12 md:max-h-[30rem] bg-[#031b4352] shadow-2xl rounded-md">
                <form className="max-w-lg w-full mx-auto ">
                    <div className="mb-8">
                        <label htmlFor="name" className="block font-medium text-white">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="mt-1 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-[#4ade80]"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="email" className="block font-medium text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-[#4ade80]"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label htmlFor="feedback" className="block font-medium text-white">
                            Feedback
                        </label>
                        <textarea
                            id="feedback"
                            className="mt-1 px-4 py-2 border rounded-lg w-full h-32 resize-none focus:outline-none focus:ring focus:border-[#4ade80]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md border border-transparent transition ease-in-out bg-secondary_red py-2 px-4 text-sm font-medium text-white shadow-sm hover:border-bg-primary_green focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleSubmit}
                    >
                        {formState.loading ? <Spinner /> : 'Submit Feedback'}
                    </button>
                </form>
            </section>
        </Layout>
    );
}
