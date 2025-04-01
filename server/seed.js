// server/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Channel = require('./models/Channel');
const Video = require('./models/Video');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const sampleVideos = [
  {
    title: "Big Buck Bunny",
    thumbnailUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png",
    duration: "8:18",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
    views: 24969123,
    likes: 1023000,
    dislikes: 4500,
    isLive: true,
    category: "Entertainment"
  },
  // Add the rest of your sample videos here
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteMany({});

    // Create a test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    // Create channels
    const channels = [
      {
        channelName: 'Vlc Media Player',
        owner: testUser._id,
        description: 'Official channel of VLC Media Player',
        subscribers: 25254545
      },
      {
        channelName: 'Blender Inc.',
        owner: testUser._id,
        description: 'Official channel of Blender Inc.',
        subscribers: 15254565
      },
      {
        channelName: 'T-Series Regional',
        owner: testUser._id,
        description: 'Regional content from T-Series',
        subscribers: 36254545
      }
    ];

    const createdChannels = await Channel.insertMany(channels);

    // Update user with channels
    testUser.channels = createdChannels.map(channel => channel._id);
    await testUser.save();

    // Create videos linked to channels
    const channelMap = {
      'Vlc Media Player': createdChannels[0]._id,
      'Blender Inc.': createdChannels[1]._id,
      'T-Series Regional': createdChannels[2]._id
    };

    const videosToInsert = sampleVideos.map(video => ({
      ...video,
      channelId: channelMap[video.author] || createdChannels[0]._id,
      uploader: testUser._id,
      uploadDate: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    }));

    const createdVideos = await Video.insertMany(videosToInsert);

    // Update channels with videos
    for (const video of createdVideos) {
      await Channel.findByIdAndUpdate(
        video.channelId,
        { $push: { videos: video._id } }
      );
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();