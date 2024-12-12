import { SyntheticEvent, useState } from 'react';

import { useRouter } from 'next/router';
import Spinner from '../../ui/Spinner';
import { reflect, ReflectionPayload } from '../../../services/reflect';
import Alert from '../../ui/Alert';
import ImageBlock from '../blocks/ImageBlock';
import { ImageComp } from '../../../types';

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

    function reflectAgain() {
        setFormState({ loading: false, error: false, submitted: false });
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
                        <div className="flex justify-center items-end flex-wrap-reverse">
                            <section className="max-h-[auto] max-w-[50rem] md:w-[45rem] p-4 mx-4 mb-8 mt-4 md:max-h-[30rem] bg-[#031b4352] shadow-2xl rounded-md">
                                {/* <h3 className="font-medium my-4 text-white text-xl text-center">
                                    Reflect & Consolidate
                                </h3> */}

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
                                        <form onSubmit={handleSubmit} className=" w-full mx-auto">
                                            <div className="mb-8">
                                                <label htmlFor="reflections" className="block font-medium text-white">
                                                    What are your main takeaways from this section?
                                                </label>
                                                <textarea
                                                    id="reflections"
                                                    name="reflections"
                                                    className="mt-1 text-sm px-4 py-2 border rounded-lg w-full h-56 resize-none focus:outline-none focus:ring focus:border-[#4ade80]"
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
                                                    className="mt-1 px-4 py-2 border rounded-lg w-full h-16 resize-none focus:outline-none focus:ring focus:border-[#4ade80]"
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
                                                <Alert
                                                    type="success"
                                                    text={
                                                        <span>
                                                            Reflection submitted successfully.
                                                            <button
                                                                type="button"
                                                                onClick={reflectAgain}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                                        reflectAgain();
                                                                    }
                                                                }}
                                                                tabIndex={0}
                                                                className="underline cursor-pointer"
                                                            >
                                                                Submit another.
                                                            </button>
                                                        </span>
                                                    }
                                                />
                                            )
                                        ) : null}
                                    </div>
                                </div>
                            </section>
                            <div>
                                <div className="bg-[#031b4352] prose text-white max-w-xs relative py-1 px-8 mt-4 shadow-2xl rounded-md ">
                                    <h2 className="text-white font-bold">Review, Reflect & Peg</h2>
                                    <p>All reflections can be reviewed in the menu under "Peg".</p>
                                    {/* <span>
                                        Submit for a{' '}
                                        <span className="text-green-500 font-bold">Great Sync Joke 😝</span>
                                    </span> */}
                                </div>
                                <div className="bg-[#031b4352] prose text-white max-w-xs relative p-8 mt-4 mb-4 md:mb-16 shadow-2xl rounded-md ">
                                    <p>** Hint ** You can use markdown to format your reflection.</p>

                                    <ul>
                                        <li>
                                            <span className="text-green-500 font-bold">##</span> Heading
                                        </li>
                                        <li>
                                            <span className="text-green-500 font-bold">###</span> SubHeading
                                        </li>
                                        <li>
                                            <span className="text-green-500 font-bold">**</span>bold
                                            <span className="text-green-500 font-bold">**</span>
                                        </li>
                                        <li>
                                            <span className="text-green-500 font-bold">*</span>italic
                                            <span className="text-green-500 font-bold">*</span>
                                        </li>
                                        <li>
                                            <span className="text-green-500 font-bold">```js </span>
                                            code block
                                            <span className="text-green-500 font-bold"> ``` </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
