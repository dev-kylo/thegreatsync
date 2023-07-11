import { Allotment } from 'allotment';
import ContentBlock from '../ContentBlock';
import Block from '../Block';
import { ResourceLink } from '../../../types';
import useResponsivePanes from '../../../hooks/useResponsivePanes';
import PaneTabs from '../PaneTabs';
import CopyButton from '../../ui/CopyButton';

type Text_Code_Props = { text: string; code: string; id: number; heading?: string; links: ResourceLink[] };

export default function Text_Code({ text, code, id, heading, links }: Text_Code_Props) {
    const { isMobile, visiblePane, setVisiblePane } = useResponsivePanes();

    if (isMobile)
        return (
            <div className="p-4 pt-16 relative">
                <PaneTabs setVisiblePane={setVisiblePane} text code />

                {visiblePane === 'text' && (
                    <div className="bg-black h-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                )}

                {visiblePane === 'code' && (
                    <div className="bg-violet-800 h-full relative">
                        <Block outerClasses="bg-code_bg" enableScroll>
                            <ContentBlock md={code} id={id} />
                        </Block>
                        <CopyButton textcode={code} />
                    </div>
                )}
            </div>
        );

    return (
        <div className="p-4">
            <Allotment defaultSizes={[1, 1]}>
                <Allotment.Pane minSize={500}>
                    <div id="one" className="bg-black h-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane>
                    <div className="bg-violet-800 h-full relative ml-6">
                        <Block outerClasses="bg-code_bg" enableScroll>
                            <ContentBlock md={code} id={id} />
                        </Block>
                        <CopyButton textcode={code} />
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
