type PaneTabsProps = {
    text?: boolean;
    code?: boolean;
    image?: boolean;
    setVisiblePane: (str: 'text' | 'image' | 'code') => void;
};

const PaneTabs = ({ text, code, image, setVisiblePane }: PaneTabsProps) => (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-16  flex items-center justify-center">
        {text && (
            <button
                type="button"
                onClick={() => setVisiblePane('text')}
                className="my-4 items-center  justify-center  border-2 border-r-2 border-secondary_lightblue bg-code_bg px-6 py-0.5 text-sm font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
            >
                Text
            </button>
        )}
        {image && (
            <button
                type="button"
                onClick={() => setVisiblePane('image')}
                className={`my-4 items-center justify-center  border-2 ${
                    code ? 'border-r-0' : 'border-r-2'
                } border-l-0 border-secondary_lightblue bg-code_bg  px-6 py-0.5 text-sm font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2`}
            >
                Model
            </button>
        )}
        {code && (
            <button
                type="button"
                onClick={() => setVisiblePane('code')}
                className="my-4 items-center justify-center  border-2 border-r-2 border-secondary_lightblue  bg-code_bg  px-6 py-0.5 text-sm font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
            >
                Code
            </button>
        )}
    </div>
);

export default PaneTabs;
