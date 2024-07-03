
export default {
    routes: [
        {
            method: "GET",
            path: "/coursesByUser",
            handler: "custom.coursesByUser",
            config: {
                policies: []
            }
        }
    ],
};
  