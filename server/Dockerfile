# Choose the base image
FROM node:16

# Create App Directory
RUN mkdir -p /usr/src/app

# Change the working directory
WORKDIR /usr/src/app

# Install nestjs cli
RUN npm i -g @nestjs/cli

# ADD the package.json file to use it to install all dependencies
ADD  package*.json ./

# Install the dependencies
RUN npm install 

# Copy all project files to image file system
COPY . .

# Specify the port
EXPOSE 8000

# The commands to run when the container is started
CMD ["npm", "start"]