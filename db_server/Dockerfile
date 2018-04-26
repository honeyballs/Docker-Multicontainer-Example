FROM mhart/alpine-node

WORKDIR /usr/src/app

#Install dependencies (Only the production dependencies)
COPY package*.json ./

RUN npm install --only=production

# Copy only the compiled file(s) to the image
COPY dist ./dist

EXPOSE 4000

CMD [ "npm", "run", "serve" ]