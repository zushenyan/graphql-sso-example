echo "Deployment start...."

# build client
rm -rf ./public/spa/static && \
rm -rf ./public/spa/index.html && \
cd ./client && \
yarn install && \
yarn run build && \
cd .. && \
cp -vr ./client/dist/* ./public/spa && \

# database mirgration
NODE_ENV=production yarn run knex migrate:latest
