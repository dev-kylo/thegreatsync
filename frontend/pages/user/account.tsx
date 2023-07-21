import Layout from '../../components/layout';
import Navbar from '../../components/ui/Navbar';

export default function Account() {
    return (
        <Layout>
            <Navbar
                chapterTitle="User Account"
                subChapterTitle="The Great Sync"
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageType="listing"
            />
            <section className="max-w-sm mx-auto">
                <div>
                    <div className="px-4 sm:px-0">
                        <h3 className="text-base font-semibold leading-7 text-gray-900">Your information</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-100">
                        <dl className="divide-y divide-gray-100">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    Margot Foster
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
