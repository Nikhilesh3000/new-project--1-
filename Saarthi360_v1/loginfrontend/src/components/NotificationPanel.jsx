function NotificationPanel() {
    return (
        <div className="notifications">
            <h7>Notifications</h7>
            <ul style={{ padding: 0, listStyleType: 'none' }}>
                <li style={{ fontSize: '12px', margin: '5px 0' }}>You have an upcoming meeting at 8am - Just now</li>
                <li style={{ fontSize: '12px', margin: '5px 0' }}>New employee access request - 5 minutes ago</li>
                <li style={{ fontSize: '12px', margin: '5px 0' }}>New client logged in - 12 hours ago</li>
                <li style={{ fontSize: '12px', margin: '5px 0' }}>New message from HR - 12 hours ago</li>
            </ul>
        </div>
    );
}

export default NotificationPanel;
