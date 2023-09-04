cmake_minimum_required(VERSION 3.26)
project(webpage)

set(CMAKE_CXX_STANDARD 17)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/templates
        DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

find_package(SQLiteCpp REQUIRED)

add_executable(webpage main.cpp)

target_link_libraries(webpage PRIVATE SQLiteCpp )