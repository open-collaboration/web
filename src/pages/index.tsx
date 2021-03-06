import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import HomeHeader from '@components/HomeHeader';
import { IProject } from '@types';
import Project from '@components/Project';
import { useSWRInfinite } from 'swr';
import { useOnScreen } from '@hooks';
import ProjectLoader from '@components/ProjectLoader';

const Content = styled.div`
    font-family: ${props => props.theme.fonts.roboto};
    padding: 0 5% 70px 5%;
    margin: 70px auto;
    max-width: 974px;
    box-sizing: content-box;
`;

const SearchBar = styled.input`
    background: url(icons/search.svg) no-repeat 98% 50% padding-box;
    font-weight: 400;
    font-size: 24px;
    width: 100%;
    background-color: ${props => props.theme.colors.grayScale.five};
    border: none;
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 60px;
    ::placeholder {
        color: ${props => props.theme.colors.grayScale.three};
    }
`;

const Tip = styled.label`
    font-size: 16px;
    color: ${props => props.theme.colors.grayScale.four};
    display: inline-flex;
    align-items: center;
`;

/**
 * Generate `n` projects objects, mocking the API response
 * @param n Number of projects to generate
 */
const getProjectsMock = (n: number): IProject[] => {
    if (n < 0) return [];
    const arr: IProject[] = [];
    for (let i = 0; i < n; i++) {
        arr.push({
            name: 'Lorem Ipsum',
            tags: ['Foo', 'Bar', 'Ipsum', 'Foo Bar'],
            shortDescription:
                'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu',
            id: i,
            skills: ['C++', 'Rust', 'JavaScript', 'HTML', 'CSS', 'AWS'],
            url: '/'
        });
    }
    return arr;
};

/**
 * Returns the next request URL for the SWR api based on the current page, data and page size
 * @param pageIndex Index of the current page
 * @param previousPageData Data of the last page
 * @param pageSize Number of projects to fetch
 */
const getSWRKey = (
    pageIndex: number,
    previousPageData: IProject[],
    pageSize: number
) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    return `/projects?page=${pageIndex + 1}&size=${pageSize}`;
};

const Index = () => {
    /*
     * https://codesandbox.io/s/using-paginated-data-with-swr-forked-5y0y2?file=/pages/index.js
     * https://github.com/vercel/swr/blob/master/examples/infinite-scroll/pages/index.js
     *
     *https://github.com/zenoamaro/react-quill/issues/284
     * https://github.com/zenoamaro/react-quill/issues/357
     * https://codesandbox.io/s/nww9q0v67p?from-embed=&file=/src/index.js
     */

    // How many projects should be fetch each time
    const PAGE_SIZE = 15;

    const ref = useRef<HTMLDivElement>(null);

    const isVisible = useOnScreen(ref);

    const {
        data,
        error,
        size,
        setSize,
        isValidating
        // @ts-ignore Get key function as expected
    } = useSWRInfinite((pageIndex: number, previousPageData: IProject[]) =>
        getSWRKey(pageIndex, previousPageData, PAGE_SIZE)
    );

    // data from swr will be an array of arrays, so convert it to a single array with all the projects
    const projects: IProject[] = data
        ? data.reduce((acm: IProject[], current) => acm.concat(current), [])
        : getProjectsMock(10); // TODO Change to an empty array when api route is working

    const isLoadingInitialData = !data && !error;
    const isLoadingMore =
        isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
    const hasDataToLoad = size < PAGE_SIZE;
    const isRefreshing = isValidating && data && data.length === size;

    useEffect(() => {
        if (isVisible && hasDataToLoad && !isRefreshing) {
            setSize(size + 1);
        }
    }, [isVisible, isRefreshing]);

    return (
        <>
            <HomeHeader />

            <Content>
                <Tip htmlFor="query">
                    <Image
                        src="/icons/lightbulb.svg"
                        className="mr-1"
                        alt="Tip Icon"
                        height={20}
                        width={20}
                    />
                    Tip: you can search by project name, keyword and needed
                    skills.
                </Tip>
                <SearchBar
                    id="query"
                    name="q"
                    type="text"
                    placeholder="Search for a project"
                />

                {/* TODO Message when there are no projects to display*/}
                {projects.map((project, i) => (
                    <Project
                        name={project.name}
                        tags={project.tags}
                        shortDescription={project.shortDescription}
                        url={project.url}
                        skills={project.skills}
                        key={project.id}
                        addSeparatorBelow={!!projects[i + 1]}
                    />
                ))}
                {/* TODO Test if it's working this way, conditionally rendering the ProjectLoader was causing bugs*/}
                <div ref={ref}>{isLoadingMore && <ProjectLoader />}</div>
            </Content>
        </>
    );
};

export default Index;
