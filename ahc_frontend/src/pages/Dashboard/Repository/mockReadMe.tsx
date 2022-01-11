export default `# ahc-uhd-image
This is the dockerfile for building the ahc-uhd-image for runnng ahc library with all required libraries and components on Ubuntu 20.04.

# Building the image and pushing to Docker hub

\`\`\`
git clone https://github.com/cengwins/ahc-uhd-image.git
cd ahc-uhd-image
docker build --progress=plain -t ahc-uhd-image . 
docker tag ahc-uhd-image cengwins/ahc-uhd-image:latest
docker login --username cengwins
docker push cengwins/ahc-uhd-image
\`\`\`

# Running the image
Note that we have to give access to the USB ports 
\`\`\`
docker pull cengwins/ahc-uhd-image
docker run -t -i --privileged -v /dev/bus/usb:/dev/bus/usb cengwins/ahc-uhd-image
\`\`\`

# Running the experiment
By default you will be in the /usr/local/src/ahc directory. You can create separate containers for each node and run the test with "-i" parameter for setting the componentinstancenumber of nodes.
\`\`\`
python3 tests/PhysicalLayers/testUsrpForDocker.py -i 0
`;
