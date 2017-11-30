# Use the openjdk base image instead of the maven until https://github.com/carlossg/docker-maven/pull/57 is merged.
# `VOLUME "$USER_HOME_DIR/.m2"` breaks pre downloading dependencies
FROM openjdk:8u121-jdk-alpine

ARG MAVEN_VERSION=3.5.2
ARG SHA=707b1f6e390a65bde4af4cdaf2a24d45fc19a6ded00fff02e91626e3e42ceaff
ARG BASE_URL=https://apache.osuosl.org/maven/maven-3/${MAVEN_VERSION}/binaries

RUN apk add --no-cache curl tar bash \
  && mkdir -p /usr/share/maven /usr/share/maven/ref \
  && curl -fsSL -o /tmp/apache-maven.tar.gz ${BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
  && echo "${SHA}  /tmp/apache-maven.tar.gz" | sha256sum -c - \
  && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
  && rm -f /tmp/apache-maven.tar.gz \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

WORKDIR /usr/src/app

# copy just the pom.xml and install dependencies for caching
ADD pom.xml .
RUN mvn verify clean --fail-never

ADD . .

RUN mvn install -DskipTests && rm -f target/*.tar.gz




FROM openjdk:8u121-jdk-alpine

COPY --from=0 /usr/src/app/target/*exec.jar .

EXPOSE 8081

CMD java -jar *exec.jar