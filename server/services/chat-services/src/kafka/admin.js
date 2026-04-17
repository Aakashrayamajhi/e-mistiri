import kafka from "../config/kafka.config.js"

export const createTopic = async () => {
    try {

        const admin = kafka.admin()
        await admin.connect()
        console.log("admin connected!")

        await admin.createTopics({
            topics: [{
                topic: "chat-message",
                numPartitions: 5,
                replicationFactor: 1,

            }]
        })

        console.log("topic created successfully")

        await admin.disconnect()
        console.log("admin disconnected successfully")
    } catch (error) {
        console.log("error while creating topic in admin:", error)
    }

}

