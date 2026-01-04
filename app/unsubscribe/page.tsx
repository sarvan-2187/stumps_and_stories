import UnsubscribeClient from "./unsubscribe-client";

export default function Page({
    searchParams,
}: {
    searchParams: { token?: string };
}) {
    return <UnsubscribeClient token={searchParams.token ?? null} />;
}