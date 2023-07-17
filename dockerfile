FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .
RUN npm install
#COPY package*.json ./
#COPY client/* ./
RUN cd client && npm install
RUN cd client && npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
#COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]
