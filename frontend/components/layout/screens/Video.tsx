import MuxVideo from '@mux/mux-video-react';
import { VideoT } from '../../../types';
import Alert from '../../ui/Alert';

type VideoProps = { data: VideoT, noPadding?: boolean }

const Video = ({ data, noPadding }: VideoProps) => {

    if (!data.data) return <Alert text="There was an error trying to retrieve the data for this video. " />

    const { playback_id, title, asset_id } = data.data.attributes;
    return (
        <div className={`w-full flex justify-center items-center ${noPadding ? '' : ' h-full p-12'}`}>
            <MuxVideo
                style={{ height: '100%', maxWidth: '100%' }}
                playbackId={playback_id}
                metadata={{
                    video_id: asset_id,
                    video_title: title,
                    // viewer_user_id: 'user-id-bc-789',
                }}
                streamType="on-demand"
                controls
            />
        </div>
    );
};

export default Video;