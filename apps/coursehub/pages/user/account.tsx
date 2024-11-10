import { useSession } from 'next-auth/react';
import Layout from '../../components/layout';
import Navbar from '../../components/ui/Navbar';
import Spinner from '../../components/ui/Spinner';

export default function Account() {
    const { data: session } = useSession();

    return (
        <Layout>
            <Navbar
                pageTitle="User Account"
                subChapterTitle="The Great Sync"
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageType="listing"
            />
            <section className="max-w-[28rem] p-8 mx-auto my-8 max-h-[24rem] bg-[#031b4352] shadow-2xl rounded-md">
                <div>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-[2rem] font-semibold leading-7 text-white">Your information</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-md font-medium leading-6 text-white">Email address: </dt>
                                <dd className="mt-1 text-md leading-6 sm:col-span-2 sm:mt-0 text-white">
                                    {!session ? <Spinner /> : session?.user.email}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
