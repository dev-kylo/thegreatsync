import { PaperClipIcon } from '@heroicons/react/20/solid';
import { getDomainName } from '../../libs/helpers';

type ExternalLinkProps = {
    type: 'download' | 'link';
    title: string;
    link: string;
    subtitle?: string;
};

const ExternalLink = ({ type, title, subtitle, link }: ExternalLinkProps) => (
    <>
        <div className="flex w-0 flex-1 items-center">
            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <div className="ml-4 flex min-w-0 flex-1 gap-2">
                <span className="truncate font-medium">{title}</span>

                <span className="flex-shrink-0 text-gray-400 lowercase">
                    {type === 'link' && !subtitle ? getDomainName(link) : subtitle}
                </span>
            </div>
        </div>
        <div className="ml-4 flex-shrink-0">
            {type === 'download' && (
                <a
                    href={link}
                    download="sds.js"
                    className="font-medium flex text-xs no-underline text-green-400 hover:text-indigo-500 uppercase"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                    </svg>
                    Download
                </a>
            )}

            {type === 'link' && (
                <a
                    href={link}
                    className="font-medium flex text-xs no-underline text-green-400 hover:text-indigo-500 uppercase"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                    </svg>
                    Go to link
                </a>
            )}
        </div>
    </>
);

export default ExternalLink;
