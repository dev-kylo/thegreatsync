
export default {
    routes: [
        {
            method: "GET",
            path: "/coursesByUser",
            handler: "custom.findByUser",
            config: {
                policies: []
            }
        }
    ],
};
  