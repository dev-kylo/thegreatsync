import MuxVideo from '@mux/mux-video-react';

const Video = () => {
    return (
        <div className='w-full h-full flex justify-center items-center p-12'>
            <MuxVideo
                style={{ height: '100%', maxWidth: '100%' }}
                playbackId="DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"
                metadata={{
                    video_id: 'video-id-123456',
                    video_title: 'Super Interesting Video',
                    viewer_user_id: 'user-id-bc-789',
                }}
                streamType="on-demand"
                controls
            />
        </div>
    );
};

export default Video;