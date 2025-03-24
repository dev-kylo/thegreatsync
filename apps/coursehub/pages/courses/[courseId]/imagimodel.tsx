import { getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext, useState } from 'react';
import { serverRedirectObject } from '../../../libs/helpers';
import { getImagimodel } from '../../../services/queries';
import { ErrorResponse, FetchImagimodelResponse } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../libs/axios';
import LoadingQuote from '../../../containers/LoadingQuote';
import { createErrorString } from '../../../libs/errorHandler';
import Layout from '../../../components/layout';
import Navbar from '../../../components/ui/Navbar';
import { NavContext } from '../../../context/nav';
import ModelCarousel from '../../../containers/ModelCarousel';
import Modal from '../../../components/ui/Modal';

const CourseImageModel = ({
    imagimodelId,
    imagimodelData,
}: {
    imagimodelId: string;
    imagimodelData: FetchImagimodelResponse;
}) => {
    const { data: session } = useSession();
    const { menuData, markPage } = useContext(NavContext);
    const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

    if (!session?.jwt || !imagimodelData) return <LoadingQuote />;

    const activeLayer = imagimodelData.data.attributes.layers.find((layer) => layer.id === activeLayerId);

    return (
        <Layout>
            <Navbar
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageTitle="The Imagimodel"
                subChapterTitle=""
                menuData={menuData}
                markPage={markPage}
            />

            <iframe title="imagimodel" src={`https://imagimodel.com/${imagimodelId}`} className="w-full h-full" />

            <Modal open={!!activeLayerId} setOpen={() => setActiveLayerId(null)}>
                {activeLayer && (
                    <ModelCarousel
                        layerSummaries={activeLayer.summaries}
                        layerImage={activeLayer.image.data}
                        layerDescription={activeLayer.description}
                        layerTitle={activeLayer?.name}
                    />
                )}
            </Modal>
        </Layout>
    );
};

export default CourseImageModel;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { courseId } = context.params as { courseId: string };

    const resp = await getImagimodel(courseId);

    if (!resp || 'error' in resp) {
        const er = resp as unknown as ErrorResponse;
        if (!er) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (er.error?.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (er.error?.status === 403)
            return serverRedirectObject(
                `/error?redirect=${
                    context.resolvedUrl
                }&error='You do not have the correct permissions to view this course. ${encodeURIComponent(
                    createErrorString(er?.error)
                )}'`
            );
        if (er.error?.status === 500)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='Oh no, the server seems to be down! ${encodeURIComponent(
                    createErrorString(er?.error)
                )}'`
            );
        return serverRedirectObject(
            `/error?redirect=${context.resolvedUrl}&error=${encodeURIComponent(createErrorString(er?.error))}`
        );
    }

    return {
        props: {
            imagimodelId: resp.data.id,
            imagimodelData: resp,
        },
    };
};
