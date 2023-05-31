import MuxVideo from '@mux/mux-video-react';
import Alert from '../../ui/Alert';
import { ResourceLink, VideoT } from '../../../types';
import ResourceDropDown from '../../ui/LinkDropdown';

type VideoProps = { data: VideoT; resources?: ResourceLink[]; noPadding?: boolean };

const Video = ({ data, resources, noPadding }: VideoProps) => {
    if (!data?.data) return <Alert text="There was an error trying to retrieve the data for this video. " />;
    const { playback_id, title, asset_id } = data.data.attributes;
    return (
        <div className={`w-full relative justify-center items-center flex flex-col ${noPadding ? '' : ' h-full p-12'}`}>
            <MuxVideo
                style={{ height: 'auto', width: '100%', maxWidth: '65vw' }}
                playbackId={playback_id}
                metadata={{
                    video_id: asset_id,
                    video_title: title,
                    // viewer_user_id: 'user-id-bc-789',
                }}
                streamType="on-demand"
                controls
            />
            {resources && resources.length > 0 && <ResourceDropDown links={resources} />}
        </div>
    );
};

export default Video;
