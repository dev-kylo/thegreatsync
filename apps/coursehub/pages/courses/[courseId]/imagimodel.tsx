import { getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';
import { serverRedirectObject } from '../../../libs/helpers';
import { getImagimodel } from '../../../services/queries';
import { ErrorResponse, FetchImagimodelResponse, Summary } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../libs/axios';
import LoadingQuote from '../../../containers/LoadingQuote';
import { createErrorString } from '../../../libs/errorHandler';
import Layout from '../../../components/layout';
import Navbar from '../../../components/ui/Navbar';
import { NavContext } from '../../../context/nav';
import ModelCarousel from '../../../containers/ModelCarousel';
import Modal from '../../../components/ui/Modal';

const CourseImageModel = ({ imagimodelData }: { imagimodelData: FetchImagimodelResponse['data'][0] }) => {
    const { data: session } = useSession();
    const { menuData, markPage } = useContext(NavContext);
    const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data as { type: string; layerId: string };
            if (data.type === 'ACTIVE_LAYER_UPDATE') {
                setActiveLayerId(data.layerId);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    if (!session?.jwt || !imagimodelData) return <LoadingQuote />;

    const activeLayer = imagimodelData.attributes.layers.find((layer) => layer.id === activeLayerId);

    const firstLayer = {
        id: Number(activeLayer?.id) || 0,
        attributes: {
            title: '',
            description: activeLayer?.description ?? '',
            image: { data: activeLayer?.image.image.data[0] },
            content: [{ id: 0, __component: 'media.text', text: activeLayer?.description ?? '' }],
        },
    } as unknown as Summary;

    const layerSummaries = [firstLayer, ...(activeLayer?.summaries?.data || [])];

    console.log({ activeLayer, layerSummaries, imagimodelData });

    return (
        <Layout>
            <Navbar
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageTitle="The Imagimodel"
                subChapterTitle=""
                menuData={menuData}
                markPage={markPage}
            />

            <iframe
                title="imagimodel"
                src={`${process.env.NEXT_PUBLIC_IMAGIMODEL_URL}?id=${imagimodelData.id}`}
                className="w-full h-full"
            />

            <Modal open={!!activeLayerId} setOpen={() => setActiveLayerId(null)}>
                {activeLayer && (
                    <ModelCarousel
                        layerSummaries={layerSummaries}
                        layerTitle={activeLayer?.name}
                        layerId={activeLayer?.id}
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
            imagimodelId: resp.data[0].id,
            imagimodelData: resp.data[0],
        },
    };
};
