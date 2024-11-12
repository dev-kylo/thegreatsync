import { SyntheticEvent, useState } from 'react';

import { useRouter } from 'next/router';
import Spinner from '../../ui/Spinner';
import { reflect, ReflectionPayload } from '../../../services/reflect';
import Alert from '../../ui/Alert';
import ImageBlock from '../blocks/ImageBlock';
import { ImageComp, ImageData } from '../../../types';

type ReflectionProps = {
    image: ImageComp;
    imageAlt: string;
    id: number;
};

export default function Reflection({ image, imageAlt, id }: ReflectionProps) {
    const router = useRouter();
    const { courseId, subchapter, chapter } = router.query as {
        courseId: string;
        chapter: string;
        subchapter: string;
    };
    const [formState, setFormState] = useState({ loading: false, error: false, submitted: false });

    async function sendReflection(payload: ReflectionPayload) {
        try {
            const res = await reflect(payload);
            if (!res || res.error) throw new Error(res?.message || 'Failed to submit reflection');
            setFormState({ loading: false, error: false, submitted: true });
        } catch (e) {
            console.log(e);
            setFormState({ loading: false, error: true, submitted: true });
        }
    }

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setFormState({ ...formState, loading: true });
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const formValues = Object.fromEntries(formData.entries());
        const payload = {
            chapter,
            subchapter,
            course: courseId,
            reflection: formValues.reflections,
            comment: formValues.feedback,
        } as ReflectionPayload;

        sendReflection(payload);
    };

    return (
        <div className="h-full w-full relative overflow-hidden rounded-lg scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll overflow-x-scroll ">
            <div className="self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
                <div className=" mx-auto w-full grid grid-cols-1 gap-1 xl:px-2 self-center">
                    <div className="absolute top-0 left-0 w-full ">
                        <section className="max-h-[auto] max-w-[40rem] md:w-[35rem] p-4 mx-auto my-8 md:max-h-[30rem] bg-[#031b4352] shadow-2xl rounded-md">
                            <h3 className="font-medium my-4 text-white text-2xl text-center"> Reflect & Consolidate</h3>

                            <div className="px-2 relative ">
                                {formState.submitted && !formState.error ? (
                                    image.data &&
                                    Array.isArray(image.data) &&
                                    image.data.length > 0 && (
                                        <ImageBlock
                                            image={image.data[0]}
                                            id={id}
                                            imageAlt={imageAlt}
                                            containerCss="relative"
                                        />
                                    )
                                ) : (
                                    <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
                                        <div className="mb-8">
                                            <label htmlFor="reflections" className="block font-medium text-white">
                                                Reflect on what you learnt in this section
                                            </label>
                                            <textarea
                                                id="reflections"
                                                name="reflections"
                                                className="mt-1 px-4 py-2 border rounded-lg w-full h-32 resize-none focus:outline-none focus:ring focus:border-[#4ade80]"
                                                required
                                            />
                                        </div>
                                        <div className="mb-8">
                                            <label htmlFor="feedback" className="block font-medium text-white">
                                                Any other thoughts, comments or feedback?
                                            </label>
                                            <textarea
                                                id="feedback"
                                                name="feedback"
                                                className="mt-1 px-4 py-2 border rounded-lg w-full h-24 resize-none focus:outline-none focus:ring focus:border-[#4ade80]"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="flex w-full justify-center rounded-md border border-transparent transition ease-in-out bg-primary_green py-2 px-4 text-sm font-medium text-white shadow-sm hover:border-bg-primary_green focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            {formState.loading ? <Spinner /> : 'Submit'}
                                        </button>
                                    </form>
                                )}
                                <div className="my-4">
                                    {formState.submitted ? (
                                        formState.error ? (
                                            <Alert text="There was an error submitting this reflection." />
                                        ) : (
                                            <Alert type="success" text="Reflection submitted successfully." />
                                        )
                                    ) : null}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
