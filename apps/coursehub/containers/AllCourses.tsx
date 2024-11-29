// import Link from 'next/link';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Layout from '../components/layout';
import Navbar from '../components/ui/Navbar';
import type { CourseByUser } from '../types';
import Spinner from '../components/ui/Spinner';

const bgMap: { [key: string]: string } = {
    1: 'https://res.cloudinary.com/the-great-sync/image/upload/c_scale,w_500/v1674395945/2000x2000/genie_assigned_zgdwyb.jpg',
    2: 'https://res.cloudinary.com/the-great-sync/image/upload/c_scale,w_500/v1667044950/2000x2000/Whirlpool_F_a_g1mm3x.jpg',
    3: 'https://res.cloudinary.com/the-great-sync/image/upload/c_scale,w_500/v1674395945/2000x2000/genie_assigned_zgdwyb.jpg',
};

const AllCourses = ({ courses }: { courses: CourseByUser[] }) => {
    return (
        <Layout>
            <Navbar
                pageTitle="A list of purchased courses"
                subChapterTitle="The Great Sync"
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageType="listing"
            />
            <section className="max-w-xl mx-auto px-4 mt-4 sm:px-6 lg:px-6 py-12">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <Link key={course.id} href={`courses/${course.id}`} passHref>
                            <li className="relative hover:cursor-pointer group">
                                <div className="h-full bg-primary_blue border-2 border-white flex items-center justify-center text-white text-base mb-3 md:mb-5 overflow-hidden relative">
                                    <Image
                                        src={bgMap[course.id]}
                                        className="object-cover w-full h-full scale-100 group-hover:scale-110 transition-all duration-400"
                                        alt=""
                                        width={800}
                                        height={1000}
                                    />
                                    <div className="absolute z-10 border-4 border-primary w-[95%] h-[95%] invisible group-hover:visible opacity-0 group-hover:opacity-100 group-hover:scale-90 transition-all duration-500" />
                                </div>

                                <p className="mb-4 font-light  text-sm md:text-lg text-center text-white">
                                    {course.title}
                                </p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </section>
        </Layout>
    );
};

export default AllCourses;
